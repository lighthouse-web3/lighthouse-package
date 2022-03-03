const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (cid) => {
  try{
    const status = (
      await axios.get(lighthouseConfig.URL + `/api/lighthouse/status/${cid}`)
    ).data;
  
    return status;
  } catch{
    return null;
  }
};
