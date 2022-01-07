const axios = require("axios");
const package_config = require("../../config.json");

exports.get_balance = async (publicKey, chain = "polygon", network = "testnet") => {
  try {
    const response = await axios.post(package_config.URL + "/api/wallet/get_balance", {
      publicKey: publicKey,
      chain: chain,
      network: network,
    });
    return response.data;
  } catch {
    return null;
  }
};
