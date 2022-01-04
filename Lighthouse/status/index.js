const axios = require("axios");
const config = require("../../config.json");

exports.status = async (cid) => {
  const response = await axios.get(config.URL + `/api/estuary/status/${cid}`);
  return response.data;
};
