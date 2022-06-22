/* istanbul ignore file */
const axios = require("axios");
const { decryptFile } = require("./encryptionBrowser");
const lighthouseConfig = require("../../../lighthouse.config");

module.exports = async (cid, fileEncryptionKey) => {
  const result = await axios.post(
    lighthouseConfig.lighthouseNode + "/api/v0/cat/" + cid,
    null,
    {
      "Content-Type": "application/json",
      Accept: "application/octet-stream",
      responseType: "blob",
    }
  );

  const decrypted = await decryptFile(
    await result.data.arrayBuffer(),
    fileEncryptionKey
  );

  if (decrypted) {
    return new Blob([decrypted]);
  } else {
    return null;
  }
};
