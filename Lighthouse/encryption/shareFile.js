const axios = require("axios");
const { getKeyShades } = require("../../Utils/bls_helper");
const lighthouseConfig = require("../../lighthouse.config");
const { addressValidator } = require("../../Utils/util");
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

    const sharedTo = Array.isArray(shareTo) ? shareTo : [shareTo];

    // send encryption key
    const _ = await Promise.all(
      nodeUrl.map((url, index) => {
        return axios.post(
          url,
          {
            address: publicKey,
            cid: cid,
            payload: {
              index: idData[index],
              key: keyShades[index],
            },
            sharedTo,
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
