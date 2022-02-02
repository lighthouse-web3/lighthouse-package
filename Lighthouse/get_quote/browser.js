// const fs = require("fs");
const axios = require("axios");
// const mime = require("mime-types");
// const Hash = require("../get_hash");
// const { resolve, relative, join } = require("path");
const config = require("../../lighthouse.config");

module.exports = async (
  e,
  publicKey,
  chain = "polygon",
  network = "testnet"
) => {
  try {
    const body = {
      fileSize: e.target.files[0].size,
      publicKey: publicKey,
      ipfs_hash: "",
      chain: chain,
      network: network,
    };
    const response = await axios.post(
      config.URL + `/api/lighthouse/get_quote`,
      body
    );

    response.data.file_size = e.target.files[0].size;
    response.data.mime_type = e.target.files[0].type;
    response.data.file_name = e.target.files[0].name;

    const meta_data = [
      {
        file_size: e.target.files[0].size,
        mime_type: e.target.files[0].type,
        file_name: e.target.files[0].name,
        ipfs_hash: "",
        cost: response.data.cost,
      },
    ];

    return {
      meta_data: meta_data,
      hash_list: "",
      gasFee: response.data.gasFee,
      current_balance: response.data.current_balance,
      total_size: response.data.file_size,
      total_cost: response.data.cost,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
