const axios = require("axios");

module.exports = async (publicKey) => {
  try {
    const subDomain = (
      await axios.get(lighthouseConfig.URL + `/api/gateway/get_subdomain?publicKey=${publicKey}`)
    ).data;
    return subDomain;
  } catch (error) {
    return null;
  }
};
