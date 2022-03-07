const ethers = require("ethers");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (publicKey, network) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      lighthouseConfig[network]["rpc"]
    );
    const balance = await provider.getBalance(publicKey);
    return ethers.utils.formatEther(balance);
  } catch {
    return null;
  }
};
