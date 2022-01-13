const fs = require("fs");
const axios = require("axios");
const mime = require("mime-types");
const Hash = require("../get_hash");
const config = require("../../lighthouse.config");

exports.get_quote = async (
  path,
  publicKey,
  chain = "polygon",
  network = "testnet"
) => {
  try {
    const stats = fs.statSync(path);
    const mime_type = mime.lookup(path);
    const fileSizeInBytes = stats.size;
    const file_name = path.split("/").pop();

    const readStream = fs.createReadStream(path);
    const ipfs_hash = await Hash.of(readStream, {
      cidVersion: 1,
      rawLeaves: true,
      chunker: "rabin",
      minChunkSize: 1048576,
    });

    const body = {
      fileSize: fileSizeInBytes,
      publicKey: publicKey,
      ipfs_hash: ipfs_hash,
      chain: chain,
      network: network,
    };
    const response = await axios.post(
      config.URL + `/api/lighthouse/get_quote`,
      body
    );

    response.data.file_size = fileSizeInBytes;
    response.data.mime_type = mime_type;
    response.data.file_name = file_name;
    response.data.ipfs_hash = ipfs_hash;

    return response.data;
  } catch (err) {
    return null;
  }
};
