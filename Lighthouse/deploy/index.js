const chalk = require("chalk");

const addCid = require("../addCid");
const deployFile = require("./deployFile");
const getCost = require("./getCost");
const pushCidToChain = require("./pushCidToChain");
const lighthouseConfig = require("../../lighthouse.config");

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

module.exports = async (
  path,
  signer,
  cli = false,
  signedMessage,
  publicKey,
  network
) => {
  // Upload File to IPFS
  const Spinner = eval("require")("cli-spinner").Spinner;
  let spinner = new Spinner("Uploading File");
  if (cli) {
    spinner.start();
  }

  let deployResponse = await deployFile(path, publicKey, signedMessage);

  if (cli) {
    spinner.stop();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  // Push CID to chain
  if (deployResponse) {
    spinner = new Spinner();
    if (cli) {
      console.log(chalk.green("Pushing CID to chain"));
      spinner.start();
    }

    const cost = await getCost(deployResponse.Size, network);
    const txObj = await pushCidToChain(
      signer,
      deployResponse.Hash,
      deployResponse.Name,
      deployResponse.Size,
      cost.toString(),
      network
    );

    if (cli) {
      spinner.stop();
      process.stdout.clearLine();
      process.stdout.cursorTo(0);

      transactionLog(txObj, network);

      console.log(chalk.green("CID pushed to chain"));
    }

    const temp = await addCid(deployResponse.Name, deployResponse.Hash);
    // const temp = await axios.post(
    //   lighthouseConfig.URL + `/api/lighthouse/add_cid`,
    //   {
    //     name: deployResponse.Name,
    //     cid: deployResponse.Hash,
    //   }
    // );

    deployResponse["txObj"] = txObj;
    return deployResponse;
  } else {
  }
};
