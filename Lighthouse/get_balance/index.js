const ethers = require("ethers");
const package_config = require("../../lighthouse.config");

module.exports = async (publicKey, network = "fantom-testnet") => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      package_config[network]["rpc"]
    );
    const balance = await provider.getBalance(publicKey);
    return ethers.utils.formatEther(balance);
  } catch {
    return null;
  }
};
