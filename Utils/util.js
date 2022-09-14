const ethers = require("ethers");
const SolanaWeb3 = require("@solana/web3.js");

const isCID = (cid) => {
  if (cid.startsWith("Qm")) {
    return /^[A-HJ-NP-Za-km-z1-9]*$/.test(cid) && cid.length == 46;
  } else if (cid.startsWith("b")) {
    return cid.length >= 50;
  }
  return true;
};

const isAddress = (address) => {
  return ethers.utils.isAddress(address);
};

const isPrivateKey = (key) => {
  return /^([0-9a-f]{64})$/i.test(key);
};

const addressValidator = (value) => {
  try {
    // Validate for EVM
    if (ethers.utils.isAddress(value?.toLowerCase())) {
      return value.toLowerCase();
    }
    // Validate for solana
    const pub = new SolanaWeb3.PublicKey(value);
    if (SolanaWeb3.PublicKey.isOnCurve(pub)) {
      return value;
    }
  } catch (error) {
    return false;
  }
};

module.exports = { isAddress, isCID, isPrivateKey, addressValidator };
