const Conf = require("conf");
const chalk = require("chalk");
const ethers = require("ethers");
const { resolve } = require("path");
const Spinner = require("cli-spinner").Spinner;

const bytesToSize = require("../Utils/byteToSize");
const getNetwork = require("../Utils/getNetwork");
const lighthouseConfig = require("../lighthouse.config");
const lighthouse = require("../Lighthouse");
const readInput = require("../Utils/readInput");
const { lighthouseAbi } = require("../Utils/contractAbi/lighthouseAbi");

const config = new Conf();

const pushCidToChain = async (signer, cid, name, size, network) => {
  try {
    const contract = new ethers.Contract(
      lighthouseConfig[network]["lighthouse_contract_address"],
      lighthouseAbi,
      signer
    );

    const txResponse = await contract.store(cid, "", name, size);

    const txReceipt = await txResponse.wait();
    return txReceipt;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getQuote = async (path, publicKey, Spinner) => {
  const spinner = new Spinner("Getting Quote...");
  spinner.start();

  const quoteResponse = await lighthouse.getQuote(path, publicKey);

  spinner.stop();
  process.stdout.clearLine();
  process.stdout.cursorTo(0);

  if (quoteResponse) {
    console.log(
      chalk.cyan("Name") +
        Array(30).fill("\xa0").join("") +
        chalk.cyan("Size") +
        Array(8).fill("\xa0").join("") +
        chalk.cyan("Type") +
        Array(20).fill("\xa0").join("")
    );

    for (let i = 0; i < quoteResponse.metaData.length; i++) {
      console.log(
        quoteResponse.metaData[i].fileName +
          Array(34 - quoteResponse.metaData[i].fileName.length)
            .fill("\xa0")
            .join("") +
          bytesToSize(quoteResponse.metaData[i].fileSize) +
          Array(
            12 -
              bytesToSize(quoteResponse.metaData[i].fileSize).toString().length
          )
            .fill("\xa0")
            .join("") +
          quoteResponse.metaData[i].mimeType
      );
    }

    console.log(
      "\n" +
        chalk.cyan("Summary") +
        "\nTotal Size: " +
        bytesToSize(quoteResponse.totalSize)
    );

    console.log(
      "Data Limit: " +
        bytesToSize(parseInt(quoteResponse.dataLimit)) +
        "\nData Used : " +
        bytesToSize(parseInt(quoteResponse.dataUsed)) +
        "\nAfter Deploy: " +
        bytesToSize(
          parseInt(quoteResponse.dataLimit) -
            (parseInt(quoteResponse.dataUsed) + quoteResponse.totalSize)
        )
    );

    const remainingAfterUpload =
      parseInt(quoteResponse.dataLimit) -
      (parseInt(quoteResponse.dataUsed) + quoteResponse.totalSize);

    return {
      fileName: quoteResponse.metaData[0].fileName,
      fileSize: quoteResponse.metaData[0].fileSize,
      cost: quoteResponse.totalCost,
      type: quoteResponse.type,
      remainingAfterUpload: remainingAfterUpload,
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

const deploy = async (path, signer, apiKey, network) => {
  let spinner = new Spinner("Uploading...");
  spinner.start();

  const deployResponse = await lighthouse.deploy(path, apiKey);
  console.log(deployResponse)

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
    selected.trim() === "Y" ||
    selected.trim() === "y" ||
    selected.trim() === "yes"
  ) {
    spinner = new Spinner("Executing transaction...");
    spinner.start();
    const txObj = await pushCidToChain(
      signer,
      deployResponse.Hash,
      deployResponse.Name,
      deployResponse.Size,
      network
    );
    spinner.stop();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    transactionLog(txObj, network);
  }

  return;
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
      try {
        // Import nodejs specific library
        const path = resolve(process.cwd(), argv.path);
        console.log(path)
        const network = getNetwork();

        // Display Quote
        const quoteResponse = await getQuote(
          path,
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          Spinner
        );

        // Deploy
        console.log(
          chalk.green(
            "Carefully check the above details are correct, then confirm to complete this upload"
          ) + " Y/n"
        );

        let options = {
          prompt: "",
        };

        const selected = await readInput(options);
        console.log(selected)
        if (
          selected.trim() === "n" ||
          selected.trim() === "N" ||
          selected.trim() === "no"
        ) {
          throw new Error("Canceled Upload");
        }

        if (!config.get("LIGHTHOUSE_GLOBAL_API_KEY")) {
          throw new Error("Please create api-key first: use api-key command");
        }

        if (quoteResponse.remainingAfterUpload < 0) {
          throw new Error(
            "File size larger than allowed limit. Please Recharge!!!"
          );
        }

        options = {
          prompt: "Enter your password: ",
          silent: true,
          default: "",
        };
        const password = await readInput(options);
        const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
          config.get("LIGHTHOUSE_GLOBAL_WALLET"),
          password.trim()
        );

        if (!decryptedWallet) {
          throw new Error("Incorrect password!");
        }

        const provider = new ethers.providers.JsonRpcProvider(
          lighthouseConfig[network]["rpc"]
        );
        const signer = new ethers.Wallet(decryptedWallet.privateKey, provider);
        const apiKey = config.get("LIGHTHOUSE_GLOBAL_API_KEY");
        await deploy(path, signer, apiKey, network);
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
};
