const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");
const { addressValidator } = require("../../Utils/util");

module.exports = async (publicKey) => {
  try {
    const address = addressValidator(publicKey);
    const messageRequested = await axios.post(
      lighthouseConfig.lighthouseBLSNode + `/api/message/${address}`
    );
    /*
      return:
        { data: { message: '809a3a85-642b-484c-9565-031ef2f183ec' } }
    */
    return { data: { message: messageRequested.data[0]["message"] } };
  } catch (error) {
    throw new Error(error.message);
  }
};
