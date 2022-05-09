const ethers = require("ethers");

module.exports = async (password) => {
  try {
    const wallet = ethers.Wallet.createRandom();
    const encryptedWallet = await wallet.encrypt(password);
    return encryptedWallet;
  } catch {
    return null;
  }
};
