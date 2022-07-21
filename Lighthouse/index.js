/* istanbul ignore file */
const addCid = require("./addCid");
const status = require("./status");
const getApiKey = require("./getApiKey");
const getBalance = require("./getBalance");
const getUploads = require("./getUploads");
const createWallet = require("./createWallet");

// Get Contract Address
const getContractAddress = require("./getContractAddress");

// Encryption BLS
const shareFile = require("./encryption/shareFile");
const accessCondition = require("./encryption/accessConditionFile");
const getAuthMessage = require("./encryption/getAuthMessage");
const fetchEncryptionKey = require("./encryption/fetchEncryptionKey");

// Key pair gen
const getEncryptionKeyPair = require("./encryption/getEncryptionKeyPair");
const decryptPassword = require("./encryption/decryptPassword");
const encryptKey = require("./encryption/encryptKey");

if (typeof window === "undefined") {
  const deploy = require("./deploy");
  const getQuote = require("./getQuote");
  const uploadEncrypted = require("./deployEncrypted/node");

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
    uploadEncrypted,
    getEncryptionKeyPair,
    decryptPassword,
    encryptKey,
    fetchEncryptionKey,
    getAuthMessage,
    shareFile,
    accessCondition
  };
} else {
  const deploy = require("./deploy/browser");
  const decryptFile = require("./deployEncrypted/browser/decryptFile");
  const uploadEncrypted = require("./deployEncrypted/browser/index.js");

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
    encryptKey,
    fetchEncryptionKey,
    getAuthMessage,
    shareFile,
    accessCondition
  };
}
