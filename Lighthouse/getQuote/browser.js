const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (fileSizeInBytes, network) => {
  try {
    // Get ticker for the given currency
    const response = await axios.get(
      lighthouseConfig.URL +
        `/api/lighthouse/get_ticker?symbol=${lighthouseConfig[network]["symbol"]}`
    );
    const tokenPriceUsd = response.data;

    const gbInBytes = lighthouseConfig.gbInBytes; // 1 GB in bytes
    const costPerGB = lighthouseConfig.costPerGB; // 5 USD per GB
    // Get cost of file
    const totalSizeInGB = fileSizeInBytes / gbInBytes;
    const totalCostUsd = totalSizeInGB * costPerGB;
    const totalCost = totalCostUsd / tokenPriceUsd;

    return {
      totalCost: totalCost,
    };
  } catch (err) {
    console.log(err);
    return {
      totalCost: null,
    };
  }
};
