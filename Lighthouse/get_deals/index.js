const axios = require("axios");
const config = require("../../config.json");

exports.get_deals = async (content_id) => {
  const response = await axios.get(
    config.URL + `/api/estuary/get_deals?content_id=${content_id}`
  );
  return response.data;
};
