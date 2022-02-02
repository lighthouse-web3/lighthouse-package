const axios = require("axios");
// const { create } = require("ipfs-http-client");
const ethers = require("ethers");

const lighthouse_config = require("../../lighthouse.config");
const { lighthouseAbi } = require("../contract_abi/lighthouseAbi.js");

const user_token = async (chain, expiry_time, network) => {
  try {
    const body = {
      network: network,
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

module.exports = async (
  e,
  cid,
  cli = false,
  chain = "polygon",
  network = "testnet"
) => {
  // Push CID to chain

  async function deployAsFile() {
    e.persist();
    console.log(e.target.files);

    const formData = new FormData();
    formData.append("data", e.target.files[0]);

    const upload_token = await user_token(chain, "24h", network);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://shuttle-4.estuary.tech/content/add");
    xhr.setRequestHeader("Authorization", `Bearer ${upload_token.token}`);

    xhr.send(formData);

    xhr.addEventListener("load", () => {
      // update the state of the component with the result here
      return {
        cid: xhr.responseText.cid,
        providers: xhr.responseText.providers,
      };
    });

    return null;
  }

  return await deployAsFile();
};
