const axios = require("axios");

const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey, signedMessage) => {
  try {
    const apiKey = (
      await axios.post(lighthouseConfig.URL + `/api/auth/get_api_key`, {
        publicKey: publicKey,
        signedMessage: signedMessage,
      })
    ).data;
    return apiKey;
  } catch (error) {
    return null;
  }
};
