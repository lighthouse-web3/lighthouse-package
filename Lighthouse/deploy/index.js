const axios = require("axios");
const chalk = require("chalk");
const { create } = require("ipfs-http-client");
const ethers = require("ethers");

const Hash = require("../get_hash");
const lighthouse_config = require("../../lighthouse.config");
const { lighthouseAbi } = require("../contract_abi/lighthouseAbi.js");

const user_token = async (expiry_time) => {
  try {
    const body = {
      expiry_time: expiry_time,
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

const push_cid_tochain = async (signer, cid, cost, chain, network) => {
  try {
    const contract = new ethers.Contract(
      lighthouse_config[network][chain]["lighthouse_contract_address"],
      lighthouseAbi,
      signer
    );

    const txResponse = await contract.store(
      cid,
      {},
      { value: ethers.utils.parseEther(cost) }
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

const getAllFiles = (
  resolve,
  relative,
  join,
  fs,
  dirPath,
  originalPath,
  arrayOfFiles
) => {
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
        resolve,
        relative,
        join,
        fs,
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
};

const get_cid = async (path, chain, network) => {
  const { resolve, relative, join } = eval("require")("path");
  const fs = eval("require")("fs");
  const mime = eval("require")("mime-types");

  if (fs.lstatSync(path).isDirectory()) {
    // Get metadata and cid for all files
    const sources = getAllFiles(resolve, relative, join, fs, path);
    const meta_data = [];
    const hash_list = [];
    let total_size = 0;

    for (let i = 0; i < sources.length; i++) {
      try {
        const readStream = fs.createReadStream(sources[i].path);
        const stats = fs.statSync(sources[i].path);
        const mime_type = mime.lookup(sources[i].path);
        const fileSizeInBytes = stats.size;
        const file_name = sources[i].path.split("/").pop();

        total_size += fileSizeInBytes;

        const cid = await Hash.of(readStream, {
          cidVersion: 1,
          rawLeaves: true,
          chunker: "rabin",
          minChunkSize: 1048576,
        });

        meta_data.push({
          file_size: fileSizeInBytes,
          mime_type: mime_type,
          file_name: file_name,
          cid: cid,
        });

        hash_list.push(cid);
      } catch (err) {
        continue;
      }
    }

    // Get ticker for the given currency
    const response = await axios.get(
      lighthouse_config.URL +
        `/api/lighthouse/get_ticker?symbol=${lighthouse_config["mainnet"][chain]["symbol"]}`
    );
    const token_price_usd = response.data;

    // Get cost of each file and total cost
    for (let i = 0; i < meta_data.length; i++) {
      const fileSize = meta_data[i].file_size / (1024 * 1024 * 1024);
      const cost_usd = fileSize * 5;
      const file_cost = cost_usd / token_price_usd;
      meta_data[i].cost = file_cost;
    }

    const totalSize = total_size / (1024 * 1024 * 1024);
    const total_cost_usd = totalSize * 5;
    const total_cost = total_cost_usd / token_price_usd;

    // Return data
    return {
      cid: meta_data[meta_data.length - 1].cid,
      total_size: total_size,
      total_cost: total_cost,
    };
  } else {
    const stats = fs.statSync(path);
    const mime_type = mime.lookup(path);
    const fileSizeInBytes = stats.size;
    const file_name = path.split("/").pop();

    const readStream = fs.createReadStream(path);
    const cid = await Hash.of(readStream, {
      cidVersion: 1,
      rawLeaves: true,
      chunker: "rabin",
      minChunkSize: 1048576,
    });

    // Get ticker for the given currency
    const response = await axios.get(
      lighthouse_config.URL +
        `/api/lighthouse/get_ticker?symbol=${lighthouse_config["mainnet"][chain]["symbol"]}`
    );
    const token_price_usd = response.data;

    // Get cost of file
    const totalSize = fileSizeInBytes / (1024 * 1024 * 1024);
    const total_cost_usd = totalSize * 5;
    const total_cost = total_cost_usd / token_price_usd;

    // return response data
    const meta_data = [
      {
        file_size: fileSizeInBytes,
        mime_type: mime_type,
        file_name: file_name,
        cid: cid,
        cost: total_cost,
      },
    ];
    return {
      cid: meta_data[0].cid,
      total_size: fileSizeInBytes,
      total_cost: total_cost,
    };
  }
};

async function deployAsFile(path) {
  const { FormData } = eval("require")("formdata-node");
  const fd = new FormData();
  const data = await eval("require")(
    "formdata-node/file-from-path"
  ).fileFromPath(path);

  fd.set("data", data, path.split("/").pop());

  const { FormDataEncoder } = eval("require")("form-data-encoder");
  const encoder = new FormDataEncoder(fd);

  const upload_token = await user_token("24h");

  const headers = {
    Authorization: `Bearer ${upload_token.token}`,
    Accept: "application/json",
    ...encoder.headers,
  };

  const { Readable } = eval("require")("stream");
  const options = {
    method: "POST",
    body: Readable.from(encoder),
    headers,
  };

  const fetch = eval("require")("node-fetch");
  const response = await fetch(
    "https://shuttle-4.estuary.tech/content/add",
    options
  );
  const obj = await response.json();

  return {
    cid: [obj.cid],
  };
}

async function deployAsDirectory(path) {
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

  const { resolve, relative, join } = eval("require")("path");
  const fs = eval("require")("fs");
  const files = await getAllFiles(resolve, relative, join, fs, path);
  let hash_list = [];

  try {
    for await (const file of client.addAll(files)) {
      hash_list.push(file.cid);
    }
  } catch (e) {
    console.log(e);
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
  };
}

module.exports = async (
  path,
  signer,
  cli = false,
  chain = "polygon",
  network = "testnet"
) => {
  // Push CID to chain
  const Spinner = eval("require")("cli-spinner").Spinner;
  let spinner = new Spinner();
  if (cli) {
    console.log(chalk.green("Pushing CID to chain"));
    spinner.start();
  }

  const cid_and_cost = await get_cid(path, chain, network);
  const txObj = await push_cid_tochain(
    signer,
    cid_and_cost.cid,
    cid_and_cost.total_cost.toFixed(18).toString(),
    chain,
    network
  );

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

  let deployResponse = "";
  if (eval("require")("fs").lstatSync(path).isDirectory()) {
    deployResponse = await deployAsDirectory(path);
  } else {
    deployResponse = await deployAsFile(path);
  }

  if (cli) {
    spinner.stop();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  deployResponse["txObj"] = txObj;
  return deployResponse;
};
