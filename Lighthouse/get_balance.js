const axios = require("axios");
const URL = require("./url");

exports.get_balance = async (publicKey, chain = "polygon") => {
  try {
    const response = await axios.post(URL + "/api/wallet/get_balance", {
      publicKey: publicKey,
      chain: chain,
    });
    return response.data;
  } catch {
    return null;
  }
};