const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");
const { shareToAddress } = require("encryption-sdk");

module.exports = async (publicKey, shareTo, cid, signedMessage) => {
  try {
    const { isSuccess, error } = await shareToAddress(
      publicKey,
      cid,
      signedMessage,
      shareTo
    );

    if (error) {
      throw new Error(error);
    }

    /*
      {
        data: {
          shareTo: [ '0x487fc2fE07c593EAb555729c3DD6dF85020B5160' ],
          cid: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s'
        }
      }
    */
    return { data: { shareTo, cid }, isSuccess };
  } catch (error) {
    throw new Error(error.message);
  }
};
