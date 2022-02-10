const axios = require("axios");
const lighthouse_config = require("../../lighthouse.config");

module.exports = async (publicKey, chain = "polygon", network = "testnet") => {
  const response = await axios.get(
    lighthouse_config.URL +
      `/api/lighthouse/get_uploads?network=${network}&chain=${chain}&publicKey=${publicKey}`
  );
  return response.data;
};
