const CryptoJS = require("crypto-js");
const EthCrypto = require("eth-crypto");

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
