const add_cid = require("./add_cid");
const create_wallet = require("./create_wallet");
const get_balance = require("./get_balance");
const get_deals = require("./get_deals");
const get_key = require("./get_key");
const get_uploads = require("./get_uploads");
const list_data = require("./list_data");
const restore_keys = require("./restore_keys");
const get_contract_address = require("./get_contract_address");
const status = require("./status");

if (typeof window === "undefined") {
  const deploy = require("./deploy");
  const get_quote = require("./get_quote");

  module.exports = {
    deploy,
    add_cid,
    create_wallet,
    get_key,
    get_quote,
    get_deals,
    get_balance,
    get_uploads,
    list_data,
    status,
    restore_keys,
    get_contract_address,
  };
} else {
  const deploy = require("./deploy/browser");
  const get_quote = require("./get_quote/browser");

  module.exports = {
    deploy,
    add_cid,
    create_wallet,
    get_key,
    get_quote,
    get_deals,
    get_balance,
    get_uploads,
    list_data,
    status,
    restore_keys,
    get_contract_address,
  };
}
