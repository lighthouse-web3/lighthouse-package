const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (
  publicKey,
  cid,
  signedMessage,
  conditions,
  aggregator = null,
  chainType = "evm"
) => {
  try {
    const nodeId = [1, 2, 3, 4, 5];
    const nodeUrl = nodeId.map(
      (elem) =>
        lighthouseConfig.lighthouseBLSNode + "/api/fileAccessConditions/" + elem
    );

    // send encryption key
    const _ = await Promise.all(
      nodeUrl.map((url, index) => {
        return axios.put(
          url,
          {
            address: publicKey,
            cid: cid,
            conditions,
            aggregator,
            chainType: chainType
          },
          {
            headers: {
              Authorization: "Bearer " + signedMessage,
            },
          }
        );
      })
    );

    return { data: { cid, conditions, aggregator } };
  } catch (error) {
    throw new Error(error.message);
  }
};
