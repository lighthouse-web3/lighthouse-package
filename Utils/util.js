const ethers = require("ethers");
const { CID } = require('multiformats/cid');

const isCID = (hash) => {
  try {
    return Boolean(CID.parse(hash));
  } catch {
    return false;
  }
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
