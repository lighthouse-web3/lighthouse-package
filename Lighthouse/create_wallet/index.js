const CryptoJS = require("crypto-js");
const ethers = require("ethers");

module.exports = async (password) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    const identity = {
      publicKey: wallet.address,
      privateKey: wallet.privateKey,
      privateKeyEncrypted: "",
    };
    identity["privateKeyEncrypted"] = CryptoJS.AES.encrypt(
      identity["privateKey"],
      password
    ).toString();
    return identity;
  } catch {
    return null;
  }
};
