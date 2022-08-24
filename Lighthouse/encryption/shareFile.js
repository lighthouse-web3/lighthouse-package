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

    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map(
      (elem) => lighthouseConfig.lighthouseBLSNode + "/api/setSharedKey/" + elem
    );

    // send encryption key
    const _ = await Promise.all(
      nodeUrl.map((url, index) => {
        return axios.post(
          url,
          {
            address: publicKey.toLowerCase(),
            cid: cid,
            payload: {
              index: idData[index],
              key: keyShades[index],
            },
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

    return { data: { shareTo, cid } };
  } catch (error) {
    return error.message;
  }
};
