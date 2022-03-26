const deployFile = require("./deployFile");

module.exports = async (
  path,
  apiKey,
  publicKey
) => {
  // Upload File to IPFS
  return(await deployFile(path, publicKey, apiKey));
};
