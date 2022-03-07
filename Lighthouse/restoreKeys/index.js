const CryptoJS = require("crypto-js");
const ethers = require("ethers");

module.exports = async (privateKey, password) => {
  try {
    const wallet = new ethers.Wallet(privateKey);
    const publicKey = wallet.address;
    const privateKeyEncrypted = CryptoJS.AES.encrypt(
      privateKey,
      password
    ).toString();

    return {
      publicKey: publicKey,
      privateKey: privateKey,
      privateKeyEncrypted: privateKeyEncrypted,
    };
  } catch {
    return null;
  }
};
