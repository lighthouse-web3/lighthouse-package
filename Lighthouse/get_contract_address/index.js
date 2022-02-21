const lighthouse_config = require("../../lighthouse.config");

module.exports = (network) => {
  return lighthouse_config[network]["lighthouse_contract_address"];
};
