const fs = require("fs");
const axios = require("axios");
const mime = require("mime-types");
const Hash = require("../get_hash");
const { resolve, relative, join } = require("path");
const config = require("../../lighthouse.config");

function getAllFiles(dirPath, originalPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];
  originalPath = originalPath || resolve(dirPath, "..");

  folder = relative(originalPath, join(dirPath, "/"));

  arrayOfFiles.push({
    path: folder.replace(/\\/g, "/"),
    mtime: fs.statSync(folder).mtime,
  });

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(
        dirPath + "/" + file,
        originalPath,
        arrayOfFiles
      );
    } else {
      file = join(dirPath, "/", file);

      arrayOfFiles.push({
        path: relative(originalPath, file).replace(/\\/g, "/"),
        content: fs.readFileSync(file),
        mtime: fs.statSync(file).mtime,
      });
    }
  });

  return arrayOfFiles;
}

module.exports = async (
  path,
  publicKey,
  chain = "polygon",
  network = "testnet"
) => {
  try {
    if (fs.lstatSync(path).isDirectory()) {
      const sources = getAllFiles(path);
      const meta_data = [];
      const hash_list = [];
      let total_size = 0;

      for (let i = 0; i < sources.length; i++) {
        try {
          const readStream = fs.createReadStream(sources[i].path);
          const stats = fs.statSync(sources[i].path);
          const mime_type = mime.lookup(sources[i].path);
          const fileSizeInBytes = stats.size;
          const file_name = sources[i].path.split("/").pop();
          total_size += fileSizeInBytes;

          const ipfs_hash = await Hash.of(readStream, {
            cidVersion: 1,
            rawLeaves: true,
            chunker: "rabin",
            minChunkSize: 1048576,
          });
          meta_data.push({
            file_size: fileSizeInBytes,
            mime_type: mime_type,
            file_name: file_name,
            ipfs_hash: ipfs_hash,
          });
          hash_list.push(ipfs_hash);
        } catch (err) {
          continue;
        }
      }

      const body = {
        fileSize: total_size,
        publicKey: publicKey,
        ipfs_hash: hash_list.toString(),
        chain: chain,
        network: network,
      };

      const response = await axios.post(
        config.URL + `/api/lighthouse/get_quote`,
        body
      );

      for (let i = 0; i < meta_data.length; i++) {
        meta_data[i].cost = response.data.cost;
      }

      return {
        meta_data: meta_data,
        hash_list: hash_list.toString(),
        gasFee: response.data.gasFee,
        current_balance: response.data.current_balance,
        total_size: total_size,
        total_cost: response.data.cost,
      };
    } else {
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

      // return response.data;
      const meta_data = [
        {
          file_size: fileSizeInBytes,
          mime_type: mime_type,
          file_name: file_name,
          ipfs_hash: ipfs_hash,
          cost: response.data.cost,
        },
      ];
      return {
        meta_data: meta_data,
        hash_list: [ipfs_hash].toString(),
        gasFee: response.data.gasFee,
        current_balance: response.data.current_balance,
        total_size: response.data.file_size,
        total_cost: response.data.cost,
      };
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};
