const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey) => {
  try {
    const messageRequested = await axios.post(
      lighthouseConfig.lighthouseBLSNode +
        `/api/message/${publicKey.toLowerCase()}`
    );

    return messageRequested.data[0]["message"];
  } catch (error) {
    return null;
  }
};
