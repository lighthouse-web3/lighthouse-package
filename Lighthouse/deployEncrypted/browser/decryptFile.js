const axios = require("axios");
const { decryptFile } = require("./encryptionBrowser");

module.exports = async (cid, fileEncryptionKey) => {
  const result = await axios.post(
    "https://node.lighthouse.storage/api/v0/cat/" + cid,
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
