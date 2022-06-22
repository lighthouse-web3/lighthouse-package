/* istanbul ignore file */
const addCid = require("./addCid");
const getApiKey = require("./getApiKey");
const createWallet = require("./createWallet");
const getBalance = require("./getBalance");
const getUploads = require("./getUploads");
const getContractAddress = require("./getContractAddress");
const getEncryptionKeyPair = require("./encryption/getEncryptionKeyPair");
const decryptPassword = require("./encryption/decryptPassword");
const status = require("./status");

if (typeof window === "undefined") {
  const deploy = require("./deploy");
  const getQuote = require("./getQuote");

  module.exports = {
    deploy,
    addCid,
    getApiKey,
    createWallet,
    getQuote,
    getBalance,
    getUploads,
    status,
    getContractAddress,
    getEncryptionKeyPair,
    decryptPassword,
  };
} else {
  const deploy = require("./deploy/browser");
  const uploadEncrypted = require("./deployEncrypted/browser");
  const decryptFile = require("./deployEncrypted/browser/decryptFile");

  module.exports = {
    deploy,
    addCid,
    getApiKey,
    getBalance,
    getUploads,
    status,
    getContractAddress,
    uploadEncrypted,
    decryptFile,
    getEncryptionKeyPair,
    decryptPassword,
  };
}
