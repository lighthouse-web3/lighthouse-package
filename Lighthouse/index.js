/* istanbul ignore file */
const addCid = require("./addCid");
const dealStatus = require("./dealStatus");
const getApiKey = require("./getApiKey");
const getBalance = require("./getBalance");
const getUploads = require("./getUploads");
const createWallet = require("./createWallet");

// Get Contract Address
const getContractAddress = require("./getContractAddress");

// Encryption BLS
const shareFile = require("./encryption/shareFile");
const getAuthMessage = require("./encryption/getAuthMessage");
const revokeFileAccess = require("./encryption/revokeFileAccess");
const accessCondition = require("./encryption/accessConditionFile");
const fetchEncryptionKey = require("./encryption/fetchEncryptionKey");
const getAccessConditions = require("./encryption/getAccessConditions");

// Key pair gen
const encryptKey = require("./encryption/encryptKey");
const decryptPassword = require("./encryption/decryptPassword");
const getEncryptionKeyPair = require("./encryption/getEncryptionKeyPair");

if (typeof window === "undefined") {
  const upload = require("./upload");
  const getQuote = require("./getQuote");
  const uploadText = require("./upload/uploadText");
  const uploadEncrypted = require("./uploadEncrypted/node");
  const decryptFile = require("./uploadEncrypted/node/decryptFile");
  const textUploadEncrypted = require("./uploadEncrypted/node/textUploadEncrypted");

  module.exports = {
    upload,
    addCid,
    getApiKey,
    createWallet,
    getQuote,
    getBalance,
    getUploads,
    dealStatus,
    getContractAddress,
    uploadEncrypted,
    decryptFile,
    getEncryptionKeyPair,
    decryptPassword,
    encryptKey,
    fetchEncryptionKey,
    getAuthMessage,
    shareFile,
    accessCondition,
    revokeFileAccess,
    textUploadEncrypted,
    getAccessConditions,
    uploadText
  };
} else {
  const upload = require("./upload/browser");
  const decryptFile = require("./uploadEncrypted/browser/decryptFile");
  const uploadEncrypted = require("./uploadEncrypted/browser/index.js");

  module.exports = {
    upload,
    addCid,
    getApiKey,
    getBalance,
    getUploads,
    dealStatus,
    getContractAddress,
    uploadEncrypted,
    decryptFile,
    getEncryptionKeyPair,
    decryptPassword,
    encryptKey,
    fetchEncryptionKey,
    getAuthMessage,
    shareFile,
    accessCondition,
    revokeFileAccess,
    getAccessConditions
  };
}
