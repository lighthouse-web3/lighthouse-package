const axios = require("axios");
const chalk = require("chalk");
const { create } = require("ipfs-http-client");
const ethers = require("ethers");
const fetch = require("node-fetch");
const fs = require("fs");
const { FormData } = require("formdata-node");
const Spinner = require("cli-spinner").Spinner;
const { resolve, relative, join } = require("path");
const { FormDataEncoder } = require("form-data-encoder");
const { Readable } = require("stream");

const lighthouse_config = require("../../lighthouse.config");
const { lighthouseAbi } = require("../contract_abi/lighthouseAbi.js");

const user_token = async (signer, chain, expiry_time, network) => {
  try {
    const body = {
      network: network,
      signer: signer,
      expiry_time: expiry_time,
      chain: chain,
    };
    const response = await axios.post(
      lighthouse_config.URL + `/api/lighthouse/user_token`,
      body
    );

    return response.data;
  } catch (e) {
    return null;
  }
};

const push_cid_tochain = async (signer, cid, chain, network) => {
  try {
    const contract = new ethers.Contract(
      lighthouse_config[network][chain]["lighthouse_contract_address"],
      lighthouseAbi,
      signer
    );

    const txResponse = await contract.store(
      cid,
      {} //,
      // { value: ethers.utils.parseEther(req.body.cost) }
    );

    const txReceipt = await txResponse.wait();
    return txReceipt;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const transactionLog = (chain, txObj, network) => {
  const networkConfig = lighthouse_config[network][chain];

  if (!networkConfig) {
    console.error(`No network under that chain ${chain}`);
  }

  console.log("Transaction: " + networkConfig.scan + txObj.transactionHash);
};

function getAllFiles(dirPath, originalPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];
  originalPath = originalPath || resolve(dirPath, "..");

  folder = relative(originalPath, join(dirPath, "/"));

  arrayOfFiles.push({
    path: folder.replace(/\\/g, "/"),
    mtime: fs.statSync(folder).mtime,
  });

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(
        dirPath + "/" + file,
        originalPath,
        arrayOfFiles
      );
    } else {
      file = join(dirPath, "/", file);

      arrayOfFiles.push({
        path: relative(originalPath, file).replace(/\\/g, "/"),
        content: fs.readFileSync(file),
        mtime: fs.statSync(file).mtime,
      });
    }
  });

  return arrayOfFiles;
}

module.exports = async (
  path,
  signer,
  cid,
  cli = false,
  chain = "polygon",
  network = "testnet"
) => {
  // Push CID to chain
  let spinner = new Spinner();
  if (cli) {
    console.log(chalk.green("Pushing CID to chain"));
    spinner.start();
  }

  const txObj = await push_cid_tochain(signer, cid, chain, network);

  if (cli) {
    spinner.stop();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    transactionLog(chain, txObj, network);

    console.log(chalk.green("CID pushed to chain"));
  }

  // Upload File to IPFS
  if (cli) {
    spinner = new Spinner("Uploading File");
    spinner.start();
  }

  async function deployAsFile() {
    const fd = new FormData();
    const data = await eval("require")(
      "formdata-node/file-from-path"
    ).fileFromPath(path);

    fd.set("data", data, path.split("/").pop());

    const encoder = new FormDataEncoder(fd);

    const upload_token = await user_token(signer, chain, "24h", network);

    const headers = {
      Authorization: `Bearer ${upload_token.token}`,
      Accept: "application/json",
      ...encoder.headers,
    };

    const options = {
      method: "POST",
      body: Readable.from(encoder),
      headers,
    };

    const response = await fetch(
      "https://shuttle-4.estuary.tech/content/add",
      options
    );
    const obj = await response.json();

    if (cli) {
      spinner.stop();
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    }

    return {
      cid: [obj.cid],
      providers: obj.providers,
      tx: txObj,
    };
  }

  async function deployAsDirectory() {
    const response = await axios.get(
      lighthouse_config.URL + "/api/lighthouse/upload_client"
    );

    const client = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: response.data,
      },
    });

    const files = getAllFiles(path);
    let hash_list = [];

    try {
      for await (const file of client.addAll(files)) {
        hash_list.push(file.cid);
      }
      // console.log(hash_list)
    } catch (e) {
      // console.log(e)
    }

    if (cli) {
      spinner.stop();
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
    }

    const temp = await axios.post(
      lighthouse_config.URL + `/api/lighthouse/add_cid`,
      {
        name: path.split("/").pop(),
        cid: hash_list[hash_list.length - 1].toString(),
      }
    );
    
    return {
      cid: hash_list[hash_list.length - 1],
      tx: txObj,
    };
  }

  if (fs.lstatSync(path).isDirectory()) {
    return await deployAsDirectory();
  }

  return await deployAsFile();
};
