const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");
const { addressValidator } = require("../../Utils/util");

module.exports = async (publicKey) => {
  try {
    const address = addressValidator(publicKey);
    const messageRequested = await axios.post(
      lighthouseConfig.lighthouseBLSNode + `/api/message/${address}`
    );
    /*
      return:
        { data: { message: 'Please sign this message to prove you are owner of this account: 269e5d45-caf7-474d-8167-ab6b140e0249' } }
    */
    return { data: { message: messageRequested.data[0]["message"] } };
  } catch (error) {
    throw new Error(error.message);
  }
};
