const axios = require("axios");
const ethers = require("ethers");

const Hash = require("../getHash");
const lighthouseConfig = require("../../lighthouse.config");
const { lighthouseAbi } = require("../contractAbi/lighthouseAbi.js");

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

const getCid = async (path, publicKey, network) => {
  const { resolve, relative, join } = eval("require")("path");
  const fs = eval("require")("fs");
  const mime = eval("require")("mime-types");

  if (fs.lstatSync(path).isDirectory()) {
    // Get metadata and cid for all files
    const sources = getAllFiles(resolve, relative, join, fs, path);
    const dirName = path.split("/").pop();
    const metaData = [];
    const hashList = [];
    let totalSize = 0;

    for (let i = 0; i < sources.length; i++) {
      try {
        const readStream = fs.createReadStream(sources[i].path);
        const stats = fs.statSync(sources[i].path);
        const mimeType = mime.lookup(sources[i].path);
        const fileSizeInBytes = stats.size;
        const fileName = sources[i].path.split("/").pop();

        totalSize += fileSizeInBytes;

        const cid = await Hash.of(readStream, {
          cidVersion: 1,
          rawLeaves: true,
          chunker: "rabin",
          minChunkSize: 1048576,
        });

        metaData.push({
          fileSize: fileSizeInBytes,
          mimeType: mimeType,
          fileName: fileName,
          cid: cid,
        });

        hashList.push(cid);
      } catch (err) {
        continue;
      }
    }

    // Get ticker for the given currency
    const response = await axios.get(
      lighthouseConfig.URL +
        `/api/lighthouse/get_ticker?symbol=${lighthouseConfig[network]["symbol"]}`
    );
    const tokenPriceUsd = response.data;

    const gbInBytes = 1073741824; // 1 GB in bytes
    const costPerGB = 5; // 5 USD per GB

    // Get cost of each file and total cost
    for (let i = 0; i < metaData.length; i++) {
      const fileSize = metaData[i].fileSize / gbInBytes;
      const costUsd = fileSize * costPerGB;
      let fileCost = costUsd / tokenPriceUsd;
      metaData[i].cost = fileCost;
    }

    const totalSizeInGB = totalSize / gbInBytes;
    const totalCostUsd = totalSizeInGB * costPerGB;
    const totalCost = totalCostUsd / tokenPriceUsd;

    // Get current balance
    const provider = new ethers.providers.JsonRpcProvider(
      lighthouseConfig[network]["rpc"]
    );
    const currentBalance = await provider.getBalance(publicKey);

    // Estimate gas fee
    const contract = new ethers.Contract(
      lighthouseConfig[network]["lighthouse_contract_address"],
      lighthouseAbi,
      provider
    );
    
    const gasFee = (
      await contract.estimateGas.store(
        hashList[hashList.length - 1],
        {},
        dirName,
        totalSize
      )
    ).toNumber();
    // Return data
    return {
      metaData: metaData,
      currentBalance: currentBalance,
      gasFee: gasFee,
      totalSize: totalSize,
      totalCost: totalCost,
    };
  } else {
    const stats = fs.statSync(path);
    const mimeType = mime.lookup(path);
    const fileSizeInBytes = stats.size;
    const fileName = path.split("/").pop();

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
    const tokenPriceUsd = response.data;

    // Get cost of file
    const gbInBytes = 1073741824; // 1 GB in bytes
    const costPerGB = 5; // 5 USD per GB
    const totalSize = fileSizeInBytes / gbInBytes;
    const totalCostUsd = totalSize * costPerGB;
    const totalCost = totalCostUsd / tokenPriceUsd;

    // Get current balance
    const provider = new ethers.providers.JsonRpcProvider(
      lighthouseConfig[network]["rpc"]
    );
    const currentBalance = await provider.getBalance(publicKey);

    // Estimate gas fee
    const contract = new ethers.Contract(
      lighthouseConfig[network]["lighthouse_contract_address"],
      lighthouseAbi,
      provider
    );
    const gasFee = (
      await contract.estimateGas.store(cid, {}, fileName, fileSizeInBytes)
    ).toNumber();

    // return response data
    const metaData = [
      {
        fileSize: fileSizeInBytes,
        mimeType: mimeType,
        fileName: fileName,
        cid: cid,
        cost: totalCost,
      },
    ];
    return {
      metaData: metaData,
      gasFee: gasFee,
      currentBalance: currentBalance,
      totalSize: fileSizeInBytes,
      totalCost: totalCost,
    };
  }
};

module.exports = async (path, publicKey, network) => {
  try {
    return await getCid(path, publicKey, network);
  } catch (err) {
    console.log(err);
    return null;
  }
};
