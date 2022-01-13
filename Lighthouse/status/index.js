const axios = require("axios");
const config = require("../../lighthouse.config");

exports.status = async (cid) => {
  const response = await axios.get(
    config.URL + `/api/lighthouse/status/${cid}`
  );
  return response.data;
};
