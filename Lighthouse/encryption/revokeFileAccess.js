const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey, revokeTo, cid, signedMessage) => {
  try {
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map(
      (elem) => lighthouseConfig.lighthouseBLSNode + "/api/setSharedKey/" + elem
    );

    // send encryption key
    const _ = await Promise.all(
      nodeUrl.map((url, index) => {
        return axios.delete(url, {
          data: {
            address: publicKey.toLowerCase(),
            cid: cid,
            revokeTo: [revokeTo.toLowerCase()],
          },
          headers: {
            Authorization: "Bearer " + signedMessage,
          },
        });
      })
    );

    return { data: { cid, revokeTo } };
  } catch (error) {
    return null;
  }
};
