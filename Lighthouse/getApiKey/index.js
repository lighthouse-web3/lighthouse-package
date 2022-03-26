const axios = require("axios");
const ethers = require("ethers");

const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (privateKey, newKey) => {
  try {
    const provider = new ethers.getDefaultProvider();
    const signer = new ethers.Wallet(privateKey, provider);
    const publicKey = await signer.getAddress();
    const message = (
      await axios.get(
        lighthouseConfig.URL +
          `/api/lighthouse/get_message?publicKey=${publicKey}&new=${newKey}`
      )
    ).data;
    const apiKey = await signer.signMessage(message);
    return apiKey;
  } catch (e) {
    console.log(e);
    return null;
  }
};
