const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey) => {
  try {
    const uploads = (
      await axios.get(
        lighthouseConfig.URL +
          `/api/user/get_uploads?publicKey=${publicKey}`
      )
    ).data;
    return uploads;
  } catch {
    return null;
  }
};
