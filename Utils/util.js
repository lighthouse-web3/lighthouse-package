const ethers = require("ethers");

const isCID = (cid) => {
  if (cid.startsWith("Qm")) {
    return /^[A-HJ-NP-Za-km-z1-9]*$/.test(cid) && cid.length == 46;
  } else if (cid.startsWith("b")) {
    return cid.length >= 50;
  }
  return true;
};

const isPrivateKey = (key) => {
  return /^([0-9a-f]{64})$/i.test(key);
};

const addressValidator = (value) => {
  if (ethers.utils.isAddress(value?.toLowerCase())) {
    return value.toLowerCase();
  } else if (/^[A-HJ-NP-Za-km-z1-9]*$/.test(value) && value.length == 44) {
    return value;
  }
  return false;
};

module.exports = { isCID, isPrivateKey, addressValidator };
