const ethers = require("ethers");

const isCID = (cid) => {
  if (
    cid.startsWith("Qm") &&
    !(/^[A-HJ-NP-Za-km-z1-9]*$/.test(cid) && cid.length == 46)
  ) {
    return false;
  } else if (cid.length <= 50 || !cid.startsWith("b")) {
    return false;
  }
  return true;
};
const isAddress = (address) => {
  return !ethers.utils.isAddress(address);
};

const isPrivateKey = (key) => {
  return /^([0-9a-f]{64})$/i.test(key)
};
module.exports = { isAddress, isCID,isPrivateKey };
