const axios = require("axios");
const chalk = require("chalk");
const fetch = require("node-fetch");
const { Readable } = require("stream");
const { FormData } = require("formdata-node");
const Spinner = require("cli-spinner").Spinner;
const { FormDataEncoder } = require("form-data-encoder");
const { fileFromPath } = require("formdata-node/file-from-path");
const config = require("../../config.json");

const user_token = async (expiry_time) => {
  try {
    const response = await axios.get(
      config.URL + "/api/estuary/user_token?expiry_time=" + expiry_time
    );
    return response.data;
  } catch {
    return null;
  }
};

const push_cid_tochain = async (privateKey, cid, chain = "polygon") => {
  try {
    const body = {
      privateKey: privateKey,
      cid: cid,
      chain: chain,
    };
    const response = await axios.post(
      config.URL + `/api/estuary/push_cid_tochain`,
      body
    );
    return response.data;
  } catch {
    return null;
  }
};

exports.deploy = async (
  path,
  privateKey,
  cid,
  cli = false,
  chain = "polygon"
) => {
  // Push CID to chain
  let spinner = new Spinner();
  if (cli) {
    console.log(chalk.green("Pushing CID to chain"));
    spinner.start();
  }

  const txObj = await push_cid_tochain(privateKey, cid, chain);

  if (cli) {
    spinner.stop();
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    if (chain === "binance") {
      console.log(
        "Transaction: " + "https://bscscan.com/tx/" + txObj.transactionHash
      );
    } else if (chain === "fantom") {
      console.log(
        "Transaction: " + "https://ftmscan.com/tx/" + txObj.transactionHash
      );
    } else {
      console.log(
        "Transaction: " + "https://polygonscan.com/tx/" + txObj.transactionHash
      );
    }

    console.log(chalk.green("CID pushed to chain"));

    console.log();
  }

  // Upload File to IPFS
  if (cli) {
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

  if (cli) {
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
