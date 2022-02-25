const axios = require("axios");
const ethers = require("ethers");

const Hash = require("../getHash");
const lighthouseConfig = require("../../lighthouse.config");
const { lighthouseAbi } = require("../contract_abi/lighthouseAbi.js");

const getAllFiles = (
  resolve,
  relative,
  join,
  fs,
  dirPath,
  originalPath,
  arrayOfFiles
) => {
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
        resolve,
        relative,
        join,
        fs,
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
};

const get_cid = async (path, publicKey, network) => {
  const { resolve, relative, join } = eval("require")("path");
  const fs = eval("require")("fs");
  const mime = eval("require")("mime-types");

  if (fs.lstatSync(path).isDirectory()) {
    // Get metadata and cid for all files
    const sources = getAllFiles(resolve, relative, join, fs, path);
    const dir_name = path.split("/").pop();
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

        const cid = await Hash.of(readStream, {
          cidVersion: 1,
          rawLeaves: true,
          chunker: "rabin",
          minChunkSize: 1048576,
        });

        meta_data.push({
          file_size: fileSizeInBytes,
          mime_type: mime_type,
          file_name: file_name,
          cid: cid,
        });

        hash_list.push(cid);
      } catch (err) {
        continue;
      }
    }

    // Get ticker for the given currency
    const response = await axios.get(
      lighthouseConfig.URL +
        `/api/lighthouse/get_ticker?symbol=${lighthouseConfig[network]["symbol"]}`
    );
    const token_price_usd = response.data;

    // Get cost of each file and total cost
    for (let i = 0; i < meta_data.length; i++) {
      const fileSize = meta_data[i].file_size / (1024 * 1024 * 1024);
      const cost_usd = fileSize * 5;
      const file_cost = cost_usd / token_price_usd;
      meta_data[i].cost = file_cost;
    }

    const totalSize = total_size / (1024 * 1024 * 1024);
    const total_cost_usd = totalSize * 5;
    const total_cost = total_cost_usd / token_price_usd;

    // Get current balance
    const provider = new ethers.providers.JsonRpcProvider(
      lighthouseConfig[network]["rpc"]
    );
    const current_balance = await provider.getBalance(publicKey);

    // Estimate gas fee
    const contract = new ethers.Contract(
      lighthouseConfig[network]["lighthouse_contract_address"],
      lighthouseAbi,
      provider
    );
    const gasFee = (
      await contract.estimateGas.store(
        hash_list[hash_list.length - 1],
        {},
        dir_name,
        total_size
      )
    ).toNumber();

    // Return data
    return {
      meta_data: meta_data,
      current_balance: current_balance,
      gasFee: gasFee,
      total_size: total_size,
      total_cost: total_cost,
    };
  } else {
    const stats = fs.statSync(path);
    const mime_type = mime.lookup(path);
    const fileSizeInBytes = stats.size;
    const file_name = path.split("/").pop();

    const readStream = fs.createReadStream(path);
    const cid = await Hash.of(readStream, {
      cidVersion: 1,
      rawLeaves: true,
      chunker: "rabin",
      minChunkSize: 1048576,
    });

    // Get ticker for the given currency
    const response = await axios.get(
      lighthouseConfig.URL +
        `/api/lighthouse/get_ticker?symbol=${lighthouseConfig[network]["symbol"]}`
    );
    const token_price_usd = response.data;

    // Get cost of file
    const totalSize = fileSizeInBytes / (1024 * 1024 * 1024);
    const total_cost_usd = totalSize * 5;
    const total_cost = total_cost_usd / token_price_usd;

    // Get current balance
    const provider = new ethers.providers.JsonRpcProvider(
      lighthouseConfig[network]["rpc"]
    );
    const current_balance = await provider.getBalance(publicKey);

    // Estimate gas fee
    const contract = new ethers.Contract(
      lighthouseConfig[network]["lighthouse_contract_address"],
      lighthouseAbi,
      provider
    );
    const gasFee = (
      await contract.estimateGas.store(cid, {}, file_name, fileSizeInBytes)
    ).toNumber();

    // return response data
    const meta_data = [
      {
        file_size: fileSizeInBytes,
        mime_type: mime_type,
        file_name: file_name,
        cid: cid,
        cost: total_cost,
      },
    ];
    return {
      meta_data: meta_data,
      gasFee: gasFee,
      current_balance: current_balance,
      total_size: fileSizeInBytes,
      total_cost: total_cost,
    };
  }
};

module.exports = async (path, publicKey, network = "fantom-testnet") => {
  try {
    return await get_cid(path, publicKey, network);
  } catch (err) {
    console.log(err);
    return null;
  }
};
