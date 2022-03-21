const addCid = require("./addCid");
const createWallet = require("./createWallet");
const getBalance = require("./getBalance");
const getKey = require("./getKey");
const getUploads = require("./getUploads");
const restoreKeys = require("./restoreKeys");
const getContractAddress = require("./getContractAddress");
const status = require("./status");

if (typeof window === "undefined") {
  const deploy = require("./deploy");
  const getQuote = require("./getQuote");

  module.exports = {
    deploy,
    addCid,
    createWallet,
    getKey,
    getQuote,
    getBalance,
    getUploads,
    status,
    restoreKeys,
    getContractAddress,
  };
} else {
  const deploy = require("./deploy/browser");
  const uploadEncrypted = require("./deploy/uploadEncryptedBrowser");
  const decryptFile = require("./deploy/decryptFile");
  const getQuote = require("./getQuote/browser");

  module.exports = {
    deploy,
    uploadEncrypted,
    decryptFile,
    addCid,
    createWallet,
    getKey,
    getQuote,
    getBalance,
    getUploads,
    status,
    restoreKeys,
    getContractAddress,
  };
}
