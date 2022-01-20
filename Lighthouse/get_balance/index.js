const ethers = require("ethers");
const package_config = require("../../lighthouse.config");

module.exports = async (publicKey, chain = "polygon", network = "testnet") => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      package_config[network][chain]["rpc"]
    );

    const balance = await provider.getBalance(publicKey);
    // balance = ethers.utils.formatEther(balance);
    return { data: Number(balance) };
  } catch {
    return null;
  }
};
