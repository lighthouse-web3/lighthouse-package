const axios = require("axios");
const URL = require("./url");

exports.list_data = async (offset, limit) => {
  if (offset !== undefined && limit !== undefined) {
    const response = await axios.get(
      URL + `/api/estuary/list_data?offset=${offset}&limit=${limit}`
    );
    return response.data;
  } else {
    const response = await axios.get(
      URL + "/api/estuary/list_data?offset=0&limit=2"
    );
    return response.data;
  }
};