const lighthouseConfig = require("../../lighthouse.config");

module.exports = (network) => {
  return lighthouseConfig[network]["lighthouse_contract_address"];
};
