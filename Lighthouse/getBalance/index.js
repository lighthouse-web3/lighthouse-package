const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey) => {
  try {
    // Get users data usage
    const user_data_usage = (
      await axios.get(
        lighthouseConfig.URL +
          `/api/lighthouse/user_data_usage?publicKey=${publicKey}`
      )
    ).data;
    return user_data_usage;
  } catch {
    return null;
  }
};
