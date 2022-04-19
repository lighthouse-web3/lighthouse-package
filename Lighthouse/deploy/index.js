const deployFile = require("./deployFile");

module.exports = async (path, apiKey) => {
  // Upload File to IPFS
  return await deployFile(path, apiKey);
};
