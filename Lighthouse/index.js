const deploy = require("./deploy");
const create_wallet = require("./create_wallet");
const get_balance = require("./get_balance");
const get_deals = require("./get_deals");
const get_key = require("./get_key");
const get_quote = require("./get_quote");
const list_data = require("./list_data");
const status = require("./status");
const restore_keys = require("./restore_keys");

module.exports = {
  deploy,
  create_wallet,
  get_key,
  get_quote,
  get_deals,
  get_balance,
  list_data,
  status,
  restore_keys,
};
