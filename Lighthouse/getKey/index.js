const CryptoJS = require("crypto-js");
const ethers = require("ethers");

module.exports = async (encPrivateKey, password) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encPrivateKey, password);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    const wallet = new ethers.Wallet(originalText);

    return { privateKey: originalText, publicKey: wallet.address };
  } catch (e) {
    return null;
  }
};
