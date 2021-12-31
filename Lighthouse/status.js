const axios = require("axios");
const URL = require("./url");

exports.status = async (cid) => {
  const response = await axios.get(URL + `/api/estuary/status/${cid}`);
  return response.data;
};