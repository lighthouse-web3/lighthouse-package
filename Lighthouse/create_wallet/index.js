const axios = require("axios");
const config = require("../../config.json");

exports.create_wallet = async (password) => {
  try {
    const response = await axios.post(
      config.URL + "/api/wallet/create_wallet",
      {
        password: password,
      }
    );
    return response.data;
  } catch {
    return null;
  }
};
