const nacl = require("tweetnacl");
const util = require("tweetnacl-util");

module.exports = (passwordEncrypted, nonce, encryptionPublicKey, secretKey) => {
  return util.encodeUTF8(
    nacl.box.open(
      util.decodeBase64(passwordEncrypted),
      util.decodeBase64(nonce),
      util.decodeBase64(encryptionPublicKey),
      util.decodeBase64(secretKey)
    )
  );
};
