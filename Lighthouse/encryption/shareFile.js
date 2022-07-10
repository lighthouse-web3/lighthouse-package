const axios = require("axios");
const { getKeyShades } = require("../../Utils/bls_helper");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (
  publicKey,
  shareTo,
  cid,
  fileEncryptionKey,
  signedMessage
) => {
  try {
    // shade encryption key
    const { idData, keyShades } = await getKeyShades(fileEncryptionKey);

    // send encryption key
    const _ = await Promise.all(
      lighthouseConfig.lighthouseBLSNodes.map((url, index) => {
        return axios.post(
          url,
          {
            address: publicKey.toLowerCase(),
            cid: cid,
            index: idData[index],
            key: keyShades[index],
            sharedTo: [shareTo.toLowerCase()],
          },
          {
            headers: {
              Authorization: "Bearer " + signedMessage,
            },
          }
        );
      })
    );

    return "Shared";
  } catch (error) {
    return error.message;
  }
};
