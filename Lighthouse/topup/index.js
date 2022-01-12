const ethers = require("ethers");
const package_config = require("../../lighthouse.config");
const { depositAbi } = require("../contract_abi/depositAbi.js");

exports.topup = async (
  signer,
  amount,
  chain = "polygon",
  network = "testnet"
) => {
  try {
    const contract = new ethers.Contract(
      package_config[network][chain]["deposit_contract_address"],
      depositAbi,
      signer
    );

    const txResponse = await contract.addDeposit({
      value: ethers.utils.parseEther(amount.toString()),
    });

    const txReceipt = await txResponse.wait();
    return txReceipt;
  } catch (e) {
    return null;
  }
};
