const axios = require("axios");
const ethers = require("ethers");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (password) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    const _ = await axios.get(lighthouseConfig.URL + `/api/auth/get_message?publicKey=${wallet.address}`);
    const encryptedWallet = await wallet.encrypt(password);
    return encryptedWallet;
  } catch(error) {
    return null;
  }
};
