const axios = require("axios");
const config = require("../../lighthouse.config");

module.exports = async (cid) => {
  const response = await axios.get(
    config.URL + `/api/lighthouse/status/${cid}`
  );
  return response.data;
};
