const ethers = require("ethers");
const package_config = require("../../config.json");
const { depositAbi } = require("../contract_abi/depositAbi.js");

exports.check_deposit = async (publicKey, chain = "polygon", network = "testnet") => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      package_config[network][chain]["rpc"]
    );
    const contract = new ethers.Contract(
      package_config[network][chain]["deposit_contract_address"],
      depositAbi,
      provider
    );
    const txResponse = await contract.deposits(publicKey);

    return(Number(txResponse[1]));
  } catch (e) {
    return({
      message: "Internal Server Error",
    });
  }
};
