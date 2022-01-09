const ethers = require("ethers");

const package_config = require("../../config.json");
const { depositAbi } = require("../contract_abi/depositAbi.js");

exports.check_deposit = async (publicKey) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(
      package_config["mainnet"]["polygon"]["rpc"]
    );

    const contract = new ethers.Contract(
      package_config["mainnet"]["polygon"]["deposit_contract_address"],
      depositAbi,
      provider
    );

    const txResponse = await contract.listWhitelistAddresses();

    let whitelisted = false;
    for (let i = 0; i < txResponse.length; i++) {
      if (publicKey === txResponse[i]) {
        whitelisted = true;
        break;
      }
    }

    return whitelisted;
  } catch (e) {
    return {
      message: "Internal Server Error",
    };
  }
};

// exports.check_deposit = async (publicKey, chain = "polygon", network = "testnet") => {
//   try {
//     const provider = new ethers.providers.JsonRpcProvider(
//       package_config[network][chain]["rpc"]
//     );
//     const contract = new ethers.Contract(
//       package_config[network][chain]["deposit_contract_address"],
//       depositAbi,
//       provider
//     );
//     const txResponse = await contract.deposits(publicKey);

//     return(Number(txResponse[1]));
//   } catch (e) {
//     return({
//       message: "Internal Server Error",
//     });
//   }
// };
