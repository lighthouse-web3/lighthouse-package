const ethers = require("ethers");
const web3 = require("web3");
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
  if (web3.utils.isAddress(value?.toLowerCase())) {
    return value.toLowerCase();
  }

  const pub = new SolanaWeb3.PublicKey(value);
  if (SolanaWeb3.PublicKey.isOnCurve(pub)) {
    return value;
  }
};

module.exports = { isAddress, isCID, isPrivateKey, addressValidator };
