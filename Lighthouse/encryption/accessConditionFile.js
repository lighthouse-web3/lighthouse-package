const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");
const { accessControl } = require("encryption-sdk");

module.exports = async (
  publicKey,
  cid,
  signedMessage,
  conditions,
  aggregator = null,
  chainType = "evm"
) => {
  try {
    // send encryption key
    const { isSuccess, error } = await accessControl(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator,
      chainType
    );

    if (error) {
      throw new Error(error);
    }
    return { data: { cid, conditions, aggregator }, isSuccess };
  } catch (error) {
    throw new Error(error.message);
  }
};
