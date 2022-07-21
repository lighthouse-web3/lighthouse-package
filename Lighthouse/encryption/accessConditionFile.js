const axios = require("axios");
const { getKeyShades } = require("../../Utils/bls_helper");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (
  publicKey,
  cid,
  fileEncryptionKey,
  signedMessage,
  conditions,
  aggregator=null
) => {
  try {
    // shade encryption key
    const { idData, keyShades } = await getKeyShades(fileEncryptionKey);

    // send encryption key
    const _ = await Promise.all(
      lighthouseConfig.lighthouseBLSNodesAccessControl.map((url, index) => {
        return axios.post(
          url,
          {
            address: publicKey.toLowerCase(),
            cid: cid,
            index: idData[index],
            key: keyShades[index],
            conditions,
            aggregator
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
