const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (fileName, cid) => {
  try {
    const response = (
      await axios.post(
        lighthouseConfig.lighthouseAPI + `/api/lighthouse/add_cid`,
        {
          name: fileName,
          cid: cid,
        }
      )
    ).data;

    return response;
  } catch (error) {
    return null;
  }
};
