const axios = require("axios");
const config = require("../../config.json");

exports.get_balance = async (publicKey, chain = "polygon") => {
  try {
    const response = await axios.post(config.URL + "/api/wallet/get_balance", {
      publicKey: publicKey,
      chain: chain,
    });
    return response.data;
  } catch {
    return null;
  }
};
