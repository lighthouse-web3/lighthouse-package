const axios = require("axios");

const lighthouseConfig = require("../../lighthouse.config");

/*
  This function is used to deploy a file to the Lighthouse server.
  It takes the following parameters:
  @param string fileSize - The size of file/folder.
  @param string network - Network on which transaction to execute.
  @return number containing quote details.
*/

module.exports = async (fileSize, network) => {
  // Get ticker for the given currency
  const tokenPriceUsd = (
    await axios.get(
      lighthouseConfig.URL +
        `/api/lighthouse/get_ticker?symbol=${lighthouseConfig[network]["symbol"]}`
    )
  ).data;

  // Get cost of file
  const totalSize = fileSize / lighthouseConfig.gbInBytes;
  const totalCostUsd = totalSize * lighthouseConfig.costPerGB;
  const totalCost = (totalCostUsd / tokenPriceUsd).toFixed(18);

  return totalCost;
};