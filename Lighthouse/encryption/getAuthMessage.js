const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");
const { addressValidator } = require("../../Utils/util");

module.exports = async (publicKey) => {
  try {
    const address = addressValidator(publicKey);
    const messageRequested = await axios.post(
      lighthouseConfig.lighthouseBLSNode + `/api/message/${address}`
    );

    return messageRequested.data[0]["message"];
  } catch (error) {
    return null;
  }
};
