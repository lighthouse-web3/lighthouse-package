const axios = require("axios");
const config = require("../../config.json");

exports.status = async (cid) => {
  const response = await axios.get(
    config.URL + `/api/lighthouse/status/${cid}`
  );
  return response.data;
};
