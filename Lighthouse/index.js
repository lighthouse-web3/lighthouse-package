const deploy = require("./deploy");
const check_deposit = require("./check_deposit");
const contract_abi = require("./contract_abi");
const create_wallet = require("./create_wallet");
const get_balance = require("./get_balance");
const get_deals = require("./get_deals");
const get_key = require("./get_key");
const get_quote = require("./get_quote");
const list_data = require("./list_data");

module.exports = {
  deploy,
  create_wallet,
  check_deposit,
  contract_abi,
  get_key,
  get_quote,
  get_deals,
  get_balance,
  list_data,
};
