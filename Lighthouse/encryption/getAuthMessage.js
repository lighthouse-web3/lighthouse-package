const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");
const { addressValidator } = require("../../Utils/util");
const { getAuthMessage } = require("encryption-sdk");

module.exports = async (publicKey) => {
  try {
    const address = addressValidator(publicKey);
    const { error, message } = await getAuthMessage(publicKey);

    if (error) {
      throw new Error(error);
    }
    /*
      return:
        { data: { message: 'Please sign this message to prove you are owner of this account: 269e5d45-caf7-474d-8167-ab6b140e0249' } }
    */
    return { data: { message } };
  } catch (error) {
    throw new Error(error.message);
  }
};
