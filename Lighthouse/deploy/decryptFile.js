const axios = require("axios");
const { decryptFile } = require("./encryptionBrowser");

module.exports = async (cid) => {
  const result = await axios.post(
    "https://node.lighthouse.storage/api/v0/cat/" + cid,
    null,
    {
      "Content-Type": "application/json",
      Accept: "application/octet-stream",
      responseType: "blob",
    }
  );

  const decrypted = await decryptFile(await result.data.arrayBuffer(), "key");

  if (decrypted) {
    return new Blob([decrypted]);
  } else {
    return null;
  }
};
