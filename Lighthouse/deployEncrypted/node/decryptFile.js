/* istanbul ignore file */
const axios = require("axios");
const { decryptFile } = eval("require")("./encryptionNode");
const lighthouseConfig = require("../../../lighthouse.config");

module.exports = async (cid, fileEncryptionKey) => {
  const result = await axios.post(
    lighthouseConfig.lighthouseNode + "/api/v0/cat/" + cid,
    null,
    {
      "Content-Type": "application/json",
      Accept: "application/octet-stream",
      responseType: "arraybuffer",
    }
  );

  const decrypted = await decryptFile(result.data, fileEncryptionKey);

  return decrypted;
};
