const addCid = require("./addCid");
const getApiKey = require("./getApiKey");
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
  const pushCidToChain = require("./pushCidToChain");

  module.exports = {
    deploy,
    addCid,
    getApiKey,
    createWallet,
    getKey,
    getQuote,
    getBalance,
    getUploads,
    status,
    pushCidToChain,
    restoreKeys,
    getContractAddress,
  };
} else {
  const deploy = require("./deploy/browser");

  module.exports = {
    deploy,
    addCid,
    getApiKey,
    createWallet,
    getKey,
    getBalance,
    getUploads,
    status,
    restoreKeys,
    getContractAddress,
  };
}
