const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (cid) => {
  try {
    const status = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/lighthouse/cid_status/?cid=${cid}`
      )
    ).data;
    return {data: { status }};
  } catch (error) {
    throw new Error(error.message);
  }
};
