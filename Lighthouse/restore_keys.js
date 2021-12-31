const CryptoJS = require("crypto-js");
const EthCrypto = require("eth-crypto");

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