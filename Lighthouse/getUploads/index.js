const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey, network = "polygon-testnet") => {
  try {
    const uploads = (
      await axios.get(
        lighthouseConfig.URL +
          `/api/lighthouse/get_uploads?network=${network}&publicKey=${publicKey}`
      )
    ).data;
    return uploads;
  } catch {
    return null;
  }
};
