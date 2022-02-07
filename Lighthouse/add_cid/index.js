const axios = require("axios");
const lighthouse_config = require("../../lighthouse.config");

module.exports = async (fileName, cid) => {
  const response = await axios.post(
    lighthouse_config.URL + `/api/lighthouse/add_cid`,
    {
      name: fileName,
      cid: cid,
    }
  );
  return response.data;
};
