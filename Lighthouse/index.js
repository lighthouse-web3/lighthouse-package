const fs = require("fs");
const axios = require("axios");
const chalk = require("chalk");
const Hash = require("./get_hash");
const mime = require("mime-types");
const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");
const { Readable } = require("stream");
const EthCrypto = require("eth-crypto");
const { FormData } = require("formdata-node");
const Spinner = require("cli-spinner").Spinner;
const { FormDataEncoder } = require("form-data-encoder");
const { fileFromPath } = require("formdata-node/file-from-path");

const URL = "http://52.66.209.251:8000";

exports.create_wallet = async (password) => {
  try {
    const response = await axios.post(URL + "/api/wallet/create_wallet", {
      password: password,
    });
    return response.data;
  } catch {
    return null;
  }
};

exports.get_key = async (encPrivateKey, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encPrivateKey, password);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    const publicKey = EthCrypto.publicKeyByPrivateKey(originalText);
    const address = EthCrypto.publicKey.toAddress(publicKey);

    return { privateKey: originalText, publicKey: address };
  } catch {
    return null;
  }
};

exports.restore_keys = async (privateKey, password) => {
  try {
    const publicKey = EthCrypto.publicKeyByPrivateKey(privateKey);
    const address = EthCrypto.publicKey.toAddress(publicKey);
    const privateKeyEncrypted = CryptoJS.AES.encrypt(
      privateKey,
      password
    ).toString();

    return {
      publicKey: address,
      privateKey: privateKey,
      privateKeyEncrypted: privateKeyEncrypted,
    };
  } catch {
    return null;
  }
};

exports.get_balance = async (publicKey) => {
  try {
    const response = await axios.post(URL + "/api/wallet/get_balance", {
      publicKey: publicKey,
    });
    return response.data;
  } catch {
    return null;
  }
};

const user_token = async (expiry_time) => {
  try {
    const response = await axios.get(
      URL + "/api/estuary/user_token?expiry_time=" + expiry_time
    );
    return response.data;
  } catch {
    return null;
  }
};

exports.get_quote = async (path, publicKey) => {
  try {
    const stats = fs.statSync(path);
    const mime_type = mime.lookup(path);
    const fileSizeInBytes = stats.size;
    const file_name = path.split("/").pop();

    const readStream = fs.createReadStream(path);
    const ipfs_hash = await Hash.of(readStream, {
      cidVersion: 1,
      rawLeaves: true,
      chunker: "rabin",
      minChunkSize: 1048576,
    });

    const body = {
      fileSize: fileSizeInBytes,
      publicKey: publicKey,
      ipfs_hash: ipfs_hash,
    };
    const response = await axios.post(URL + `/api/estuary/get_quote`, body);

    response.data.file_size = fileSizeInBytes;
    response.data.mime_type = mime_type;
    response.data.file_name = file_name;
    response.data.ipfs_hash = ipfs_hash;

    return response.data;
  } catch (err) {
    return null;
  }
};

const push_cid_tochain = async (privateKey, cid) => {
  try {
    const body = {
      privateKey: privateKey,
      cid: cid,
    };
    const response = await axios.post(
      URL + `/api/estuary/push_cid_tochain`,
      body
    );
    return response.data;
  } catch {
    return null;
  }
};

exports.deploy = async (path, privateKey, cid, cli=false) => {

  // Push CID to chain
  let spinner = new Spinner();
  if(cli){
    console.log(chalk.green("Pushing CID to chain"));
    spinner.start();
  }

  const txObj = await push_cid_tochain(privateKey, cid);
  
  if(cli){
    spinner.stop();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(
      "Transaction: " +
        "https://polygonscan.com/tx/" +
        txObj.transactionHash
    );
    console.log(chalk.green("CID pushed to chain"));

    console.log();
  }

  // Upload File to IPFS
  if(cli){
    spinner = new Spinner("Uploading File");
    spinner.start();
  }

  const fd = new FormData();
  const data = await fileFromPath(path);

  fd.set("data", data, path.split("/").pop());

  const encoder = new FormDataEncoder(fd);

  const upload_token = await user_token("24h");

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
  
  if(cli){
    spinner.stop();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  return {
    cid: obj.cid,
    providers: obj.providers,
    tx: txObj,
  };
};

exports.status = async (cid) => {
  const response = await axios.get(URL + `/api/estuary/status/${cid}`);
  return response.data;
};

exports.list_data = async (offset, limit) => {
  if (offset !== undefined && limit !== undefined) {
    const response = await axios.get(
      URL + `/api/estuary/list_data?offset=${offset}&limit=${limit}`
    );
    return response.data;
  } else {
    const response = await axios.get(
      URL + "/api/estuary/list_data?offset=0&limit=2"
    );
    return response.data;
  }
};

exports.get_deals = async (content_id) => {
  const response = await axios.get(
    URL + `/api/estuary/get_deals?content_id=${content_id}`
  );
  return response.data;
};
