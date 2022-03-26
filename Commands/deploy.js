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
      chalk.cyan("Name") +
      Array(30).fill("\xa0").join("") +
      chalk.cyan("Size") +
      Array(8).fill("\xa0").join("") +
      chalk.cyan("Type") +
      Array(20).fill("\xa0").join("")
    );

    for (let i = 0; i < response.metaData.length; i++) {
      console.log(
        response.metaData[i].fileName +
          Array(34 - response.metaData[i].fileName.length)
            .fill("\xa0")
            .join("") +
          bytesToSize(response.metaData[i].fileSize) +
          Array(
            12 - bytesToSize(response.metaData[i].fileSize).toString().length
          )
            .fill("\xa0")
            .join("") +
          response.metaData[i].mimeType 
      );
    }

    console.log(
      "\n" +
        chalk.cyan("Summary") +
        "\nTotal Size: " +
        bytesToSize(response.totalSize)
    );

    console.log(
        "Data Limit: " +
        response.dataLimit.toFixed(8) + " GB" +
        "\nData Used : " +
        response.dataUsed.toFixed(8) + " GB"
    );

    const totalSizeInGB = response.totalSize / lighthouseConfig.gbInBytes;
    const remainingAfterUpload = response.dataLimit - (response.dataUsed + totalSizeInGB);

    return {
      fileName: response.metaData[0].fileName,
      fileSize: response.metaData[0].fileSize,
      cost: response.totalCost,
      type: response.type,
      remainingAfterUpload: remainingAfterUpload
    };
  } else {
    console.log(chalk.red("Error getting quote"));
    process.exit();
  }
};

const transactionLog = (txObj, network) => {
  const networkConfig = lighthouseConfig[network];

  if (!networkConfig) {
    console.error(`No network found for ${network}`);
  }

  if (txObj) {
    console.log("Transaction: " + networkConfig.scan + txObj.transactionHash);
  } else {
    console.log("Transaction failed");
  }
};

const deploy = async (path, signer, publicKey, apiKey, network) => {
  let spinner = new Spinner("Uploading...");
  spinner.start();

  const deployResponse = await lighthouse.deploy(
    path,
    apiKey,
    publicKey
  );

  spinner.stop();
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

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

  console.log(
    chalk.green(
      "Push CID to blockchain network now(Y) or we will do it for you(N)"
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
  ){
    spinner = new Spinner("Executing transaction...");
    spinner.start();
    const txObj = await lighthouse.pushCidToChain(signer, deployResponse.Hash, deployResponse.Name, deployResponse.Size, network);
    spinner.stop();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    transactionLog(txObj, network);
  }

  return
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
        quoteResponse.remainingAfterUpload < 0
          ? (() => {
              console.log(chalk.red("File size larger than allowed limit. Please Recharge!!!"));
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
                config.get("LIGHTHOUSE_GLOBAL_PRIVATEKEYENCRYPTED"),
                password.trim()
              );
              if (key) {
                const provider = new ethers.providers.JsonRpcProvider(
                  lighthouseConfig[network]["rpc"]
                );
                const signer = new ethers.Wallet(key.privateKey, provider);
                const publicKey = await signer.getAddress();
                const apiKey = config.get("LIGHTHOUSE_GLOBAL_API_KEY");

                apiKey?
                await deploy(path, signer, publicKey, apiKey, network)
                :
                console.log(chalk.red("API Key not found!"));
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
