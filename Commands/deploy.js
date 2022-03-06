const axios = require("axios");
const Conf = require("conf");
const chalk = require("chalk");
const ethers = require("ethers");
const { resolve } = require("path");
const Spinner = require("cli-spinner").Spinner;

const bytesToSize = require("./Utils/byteToSize");
const getNetwork = require("./Utils/getNetwork");
const lighthouseConfig = require("../lighthouse.config");
const lighthouse = require("../Lighthouse");
const readInput = require("./Utils/readInput");

const config = new Conf();

const getQuote = async (path, publicKey, network, Spinner) => {
  const spinner = new Spinner("Getting Quote...");
  spinner.start();

  const response = await lighthouse.getQuote(path, publicKey, network);

  spinner.stop();
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  if (response) {
    console.log(
      chalk.cyan("CID") +
        Array(60).fill("\xa0").join("") +
        chalk.cyan("Size") +
        Array(8).fill("\xa0").join("") +
        chalk.cyan("Fee") +
        Array(21).fill("\xa0").join("") +
        chalk.cyan("Type") +
        Array(20).fill("\xa0").join("") +
        chalk.cyan("Name")
    );

    for (let i = 0; i < response.metaData.length; i++) {
      console.log(
        response.metaData[i].cid +
          Array(63 - response.metaData[i].cid.length)
            .fill("\xa0")
            .join("") +
          bytesToSize(response.metaData[i].fileSize) +
          Array(
            12 - bytesToSize(response.metaData[i].fileSize).toString().length
          )
            .fill("\xa0")
            .join("") +
          response.metaData[i].cost +
          Array(24 - response.metaData[i].cost.toString().length)
            .fill("\xa0")
            .join("") +
          response.metaData[i].mimeType +
          Array(24 - response.metaData[i].mimeType.toString().length)
            .fill("\xa0")
            .join("") +
          response.metaData[i].fileName
      );
    }

    console.log(
      "\n" +
        chalk.cyan("Summary") +
        "\nTotal Size: " +
        bytesToSize(response.totalSize)
    );

    console.log(
      "Fees: " +
        response.totalCost.toFixed(18) +
        " " +
        lighthouseConfig[network]["symbol"] +
        "\nGas Fees: " +
        ethers.utils.parseUnits(
          ethers.utils.formatEther(response.gasFee),
          "ether"
        ) +
        " wei" +
        "\nTotal Fee: " +
        Number(
          Number(response.totalCost.toFixed(18)) +
            Number(ethers.utils.formatEther(response.gasFee))
        ) +
        " " +
        lighthouseConfig[network]["symbol"] +
        "\n" +
        chalk.cyan("\nWallet") +
        "\nAddress: " +
        config.get("Lighthouse_publicKey") +
        "\nCurrent balance: " +
        response.currentBalance * Math.pow(10, -18) +
        " " +
        lighthouseConfig[network]["symbol"]
    );

    const balanceAfterDeploy = Number(
      Number(response.currentBalance * Math.pow(10, -18)) -
        Number(
          Number(response.totalCost.toFixed(18)) +
            Number(ethers.utils.formatEther(response.gasFee))
        )
    );

    console.log(
      "Balance after deploy: " +
        balanceAfterDeploy +
        " " +
        lighthouseConfig[network]["symbol"] +
        "\n"
    );

    return {
      fileName: response.metaData[0].fileName,
      cid: response.metaData[0].cid,
      fileSize: response.metaData[0].fileSize,
      cost: response.totalCost,
      balanceAfterDeploy: balanceAfterDeploy,
      type: response.type,
    };
  } else {
    console.log(chalk.red("Error getting quote"));
    process.exit();
  }
};

const deploy = async (path, signer, signedMessage, publicKey, network) => {
  const deployResponse = await lighthouse.deploy(
    path,
    signer,
    true,
    signedMessage,
    publicKey,
    network
  );

  console.log(
    chalk.green("File Deployed, visit following url to view content!\n") +
      chalk.cyan(
        "Visit: " +
          "https://gateway.lighthouse.storage/ipfs/" +
          deployResponse.Hash +
          "\n"
      ) +
      chalk.cyan(
        Array(7).fill("\xa0").join("") +
          "https://ipfs.io/ipfs/" +
          deployResponse.Hash
      )
  );

  console.log("CID: " + deployResponse.Hash);
  process.exit();
};

module.exports = {
  command: "deploy <path>",
  desc: "Deploy a file",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 deploy <path>\n\n" +
          chalk.green("Description: ") +
          "Deploy a file\n\n" +
          chalk.cyan("Options:\n") +
          Array(3).fill("\xa0").join("") +
          "--path: Required, path to file\n\n" +
          chalk.magenta("Example:") +
          Array(3).fill("\xa0").join("") +
          "lighthouse-web3 deploy /home/cosmos/Desktop/ILoveAnime.jpg\n"
      );
    } else {
      // Import nodejs specific library
      const path = resolve(process.cwd(), argv.path);
      const network = getNetwork();

      // Display Quote
      const quoteResponse = await getQuote(
        path,
        config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
        network,
        Spinner
      );

      // Deploy
      console.log(
        chalk.green(
          "Carefully check the above details are correct, then confirm to complete this upload"
        ) + " Y/n"
      );

      const options = {
        prompt: "",
      };

      const selected = await readInput(options);
      if (
        selected.trim() == "Y" ||
        selected.trim() == "y" ||
        selected.trim() == "yes"
      ) {
        quoteResponse.balanceAfterDeploy < 0
          ? (() => {
              console.log(chalk.red("Insufficient balance!"));
              process.exit();
            })()
          : (async () => {
              const options = {
                prompt: "Enter your password: ",
                silent: true,
                default: "",
              };
              const password = await readInput(options);
              const key = await lighthouse.getKey(
                config.get("Lighthouse_privateKeyEncrypted"),
                password.trim()
              );
              if (key) {
                const provider = new ethers.providers.JsonRpcProvider(
                  lighthouseConfig[network]["rpc"]
                );
                const signer = new ethers.Wallet(key.privateKey, provider);
                const publicKey = await signer.getAddress();
                const messageResponse = await axios.get(
                  `https://api.lighthouse.storage/api/lighthouse/get_message?publicKey=${publicKey}`
                );
                const message = messageResponse.data;
                const signedMessage = await signer.signMessage(message);

                await deploy(path, signer, signedMessage, publicKey, network);
              } else {
                console.log(chalk.red("Something Went Wrong!"));
                process.exit();
              }
            })();
      } else {
        console.log(chalk.red("Cancelled"));
        process.exit();
      }
    }
  },
};
