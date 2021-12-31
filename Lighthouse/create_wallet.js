const axios = require("axios");
const URL = require("./url");

exports.create_wallet = async (password) => {
  try {
    const response = await axios.post(URL + "/api/wallet/create_wallet", {
      password: password,
    });
    return response.data;
  } catch {
    return null;
  }
};
