const axios = require("axios");
const lighthouse_config = require("../../lighthouse.config");

module.exports = async (publicKey, network = "polygon-testnet") => {
  try {
    const response = await axios.get(
      lighthouse_config.URL +
        `/api/lighthouse/get_uploads?network=${network}&publicKey=${publicKey}`
    );
    return response.data;
  } catch {
    return null;
  }
};
