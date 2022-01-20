const CryptoJS = require("crypto-js");
const EthCrypto = require("eth-crypto");

module.exports = async (password) => {
  try {
    const identity = EthCrypto.createIdentity();
    identity["privateKeyEncrypted"] = CryptoJS.AES.encrypt(
      identity["privateKey"],
      password
    ).toString();
    const publicKey = EthCrypto.publicKeyByPrivateKey(identity["privateKey"]);
    const address = EthCrypto.publicKey.toAddress(publicKey);
    identity["publicKey"] = address;
    delete identity["address"];
    return identity;
  } catch {
    return null;
  }
};
