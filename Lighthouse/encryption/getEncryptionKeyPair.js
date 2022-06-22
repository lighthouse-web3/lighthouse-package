const nacl = require("tweetnacl");
const util = require("tweetnacl-util");

module.exports = () => {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    secretKey: util.encodeBase64(keyPair.secretKey),
  };
};
