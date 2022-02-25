const axios = require("axios");
const chalk = require("chalk");
const ethers = require("ethers");

const lighthouseConfig = require("../../lighthouse.config");
const { lighthouseAbi } = require("../contractAbi/lighthouseAbi.js");

const pushCidToChain = async (signer, cid, name, size, cost, network) => {
  try {
    const contract = new ethers.Contract(
      lighthouseConfig[network]["lighthouse_contract_address"],
      lighthouseAbi,
      signer
    );

    const txResponse = await contract.store(cid, "", name, size, {
      value: ethers.utils.parseEther(cost),
    });

    const txReceipt = await txResponse.wait();
    return txReceipt;
  } catch (e) {
    console.log(e);
    return null;
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

const getCost = async (fileSize, network) => {
  // Get ticker for the given currency
  const tokenPriceUsd = (
    await axios.get(
      lighthouseConfig.URL +
        `/api/lighthouse/get_ticker?symbol=${lighthouseConfig[network]["symbol"]}`
    )
  ).data;

  // Get cost of file
  const gbInBytes = 1073741824; // 1 GB in bytes
  const costPerGB = 5; // 5 USD per GB
  const totalSize = fileSize / gbInBytes;
  const totalCostUsd = totalSize * costPerGB;
  const totalCost = (totalCostUsd / tokenPriceUsd).toFixed(18);

  return totalCost;
};

function deployFile(sourcePath, publicKey, signedMessage) {
  const fs = eval("require")("fs");
  const NodeFormData = eval("require")("form-data");
  const recursive = eval("require")("recursive-fs");
  const basePathConverter = eval("require")("base-path-converter");
  const token = "Bearer " + publicKey + " " + signedMessage;

  return new Promise((resolve, reject) => {
    const endpoint = `https://node.lighthouse.storage/api/v0/add`;

    fs.stat(sourcePath, (err, stats) => {
      if (err) {
        reject(err);
      }
      if (stats.isFile()) {
        //we need to create a single read stream instead of reading the directory recursively
        const data = new NodeFormData();

        data.append("file", fs.createReadStream(sourcePath));

        axios
          .post(endpoint, data, {
            withCredentials: true,
            maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
            maxBodyLength: "Infinity",
            headers: {
              "Content-type": `multipart/form-data; boundary= ${data._boundary}`,
              Authorization: token,
            },
          })
          .then(function (result) {
            if (result.status !== 200) {
              reject(
                new Error(
                  `unknown server response while pinning File to IPFS: ${result}`
                )
              );
            }
            resolve(result.data);
          })
          .catch(function (error) {
            console.log(error);
            reject(formattedError);
          });
      } else {
        recursive.readdirr(sourcePath, function (err, dirs, files) {
          if (err) {
            reject(new Error(err));
          }

          let data = new NodeFormData();

          files.forEach((file) => {
            //for each file stream, we need to include the correct relative file path
            data.append("file", fs.createReadStream(file), {
              filepath: basePathConverter(sourcePath, file),
            });
          });

          axios
            .post(endpoint, data, {
              withCredentials: true,
              maxContentLength: "Infinity",
              maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
              headers: {
                "Content-type": `multipart/form-data; boundary= ${data._boundary}`,
                Authorization: token,
              },
            })
            .then(function (result) {
              if (result.status !== 200) {
                reject(
                  new Error(
                    `unknown server response while pinning File to IPFS: ${result}`
                  )
                );
              }

              const temp = result.data.split("\n");
              const response = JSON.parse(temp[temp.length - 2]);
              resolve(response);
            })
            .catch(function (error) {
              reject(error);
            });
        });
      }
    });
  });
}

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

    const temp = await axios.post(
      lighthouseConfig.URL + `/api/lighthouse/add_cid`,
      {
        name: deployResponse.Name,
        cid: deployResponse.Hash,
      }
    );

    deployResponse["txObj"] = txObj;
    return deployResponse;
  } else {
  }
};
