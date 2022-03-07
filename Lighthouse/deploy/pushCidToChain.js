const ethers = require("ethers");

const lighthouseConfig = require("../../lighthouse.config");
const { lighthouseAbi } = require("../contractAbi/lighthouseAbi.js");

/*
  This function is used to deploy a file to the Lighthouse server.
  It takes the following parameters:
  @param {string} signer - Signer to execute transaction.
  @param {string} cid - CID to push on contract.
  @param {string} name - Name of file to upload.
  @param {string} size - Size of file to upload.
  @param {string} cost - cost to be paid.
  @param {string} network - Network on which transaction to execute.
*/

module.exports = async (signer, cid, name, size, cost, network) => {
  try {
    const contract = new ethers.Contract(
      lighthouseConfig[network]["lighthouse_contract_address"],
      lighthouseAbi,
      signer
    );

    const txResponse = await contract.store(cid, "", name, size, {
      value: ethers.utils.parseEther(cost),
    });

    const txReceipt = await txResponse.wait();
    return txReceipt;
  } catch (e) {
    console.log(e);
    return null;
  }
};
