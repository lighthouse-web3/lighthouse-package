const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (cid) => {
  try {
    const status = (
      await axios.get(
        lighthouseConfig.URL + `/api/lighthouse/cid_status/?cid=${cid}`
      )
    ).data;

    return status;
  } catch {
    return null;
  }
};
