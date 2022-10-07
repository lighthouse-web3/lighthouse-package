const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (
  publicKey,
  shareTo,
  cid,
  signedMessage
) => {
  try {
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
    
    /*
      {
        data: {
          shareTo: [ '0x487fc2fE07c593EAb555729c3DD6dF85020B5160' ],
          cid: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s'
        }
      }
    */
    return { data: { shareTo, cid } };
  } catch (error) {
    throw new Error(error.message);
  }
};
