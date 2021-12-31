const axios = require("axios");
const URL = require("./url");

exports.get_deals = async (content_id) => {
  const response = await axios.get(
    URL + `/api/estuary/get_deals?content_id=${content_id}`
  );
  return response.data;
};
