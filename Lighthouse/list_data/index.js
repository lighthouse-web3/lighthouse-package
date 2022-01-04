const axios = require("axios");
const config = require("../../config.json");

exports.list_data = async (offset, limit) => {
  if (offset !== undefined && limit !== undefined) {
    const response = await axios.get(
      config.URL + `/api/estuary/list_data?offset=${offset}&limit=${limit}`
    );
    return response.data;
  } else {
    const response = await axios.get(
      config.URL + "/api/estuary/list_data?offset=0&limit=2"
    );
    return response.data;
  }
};
