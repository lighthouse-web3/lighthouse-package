const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const mime = require("mime-types");
const IPFS = require("ipfs");
const EthCrypto = require("eth-crypto");
const CryptoJS = require("crypto-js");

const URL = "http://localhost:8000";

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

exports.user_token = async (expiry_time) => {
  try {
    const response = await axios.get(
      URL + "/api/estuary/user_token?expiry_time=" + expiry_time
    );
    return response.data;
  } catch {
    return null;
  }
};

exports.deploy = async (path, token) => {
  var formData = new FormData();
  formData.append("data", fs.createReadStream(path));

  const headers = formData.getHeaders();
  const response = await axios.post(
    "https://shuttle-1.estuary.tech/content/add",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    }
  );
  return response.data;
};

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`;
}

exports.get_quote = async (path, publicKey) => {
  try {
    const stats = fs.statSync(path);
    const mime_type = mime.lookup(path);
    const fileSizeInBytes = stats.size;
    const file_name = path.split("/").pop();

    // disable logs of IPFS.create()
    const console_log = console.log;
    console.log = function () {};
    const node = await IPFS.create();
    const file = await node.add(path, { onlyHash: true, cidVersion: 1 });
    const ipfs_hash = file.path;
    node.stop();
    console.log = console_log;

    const body = {
      fileSize: fileSizeInBytes,
      publicKey: publicKey,
      ipfs_hash: ipfs_hash,
    };
    const response = await axios.post(URL + `/api/estuary/get_quote`, body);

    response.data.file_size = bytesToSize(fileSizeInBytes);
    response.data.mime_type = mime_type;
    response.data.file_name = file_name;
    response.data.fee = response.data.cost + response.data.gasFee;
    response.data.ipfs_hash = ipfs_hash;

    return response.data;
  } catch (err) {
    return null;
  }
};

exports.push_cid_tochain = async (privateKey, cid) => {
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
