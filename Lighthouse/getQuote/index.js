const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

// Function to create a directory tree for all files in folder
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

// Function return cost and file metadata
const getCosting = async (path, publicKey, network) => {
  const { resolve, relative, join } = eval("require")("path");
  const fs = eval("require")("fs");
  const mime = eval("require")("mime-types");

  // Get users data usage
  const user_data_usage = (await axios.get(
    lighthouseConfig.URL +
      `/api/lighthouse/user_data_usage?publicKey=${publicKey}`
  )).data;

  if (fs.lstatSync(path).isDirectory()) {
    // Get metadata and cid for all files
    const sources = getAllFiles(resolve, relative, join, fs, path);
    const metaData = [];
    let totalSize = 0;

    for (let i = 0; i < sources.length; i++) {
      try {
        const stats = fs.statSync(sources[i].path);
        const mimeType = mime.lookup(sources[i].path);
        const fileSizeInBytes = stats.size;
        const fileName = sources[i].path.split("/").pop();

        totalSize += fileSizeInBytes;

        metaData.push({
          fileSize: fileSizeInBytes,
          mimeType: mimeType,
          fileName: fileName,
        });
      } catch (err) {
        continue;
      }
    }

    // Return data
    return {
      metaData: metaData,
      dataLimit: user_data_usage.dataLimit,
      dataUsed: user_data_usage.dataUsed,
      totalSize: totalSize,
    };
  } else {
    const stats = fs.statSync(path);
    const mimeType = mime.lookup(path);
    const fileSizeInBytes = stats.size;
    const fileName = path.split("/").pop();

    // return response data
    const metaData = [
      {
        fileSize: fileSizeInBytes,
        mimeType: mimeType,
        fileName: fileName,
      },
    ];
    return {
      metaData: metaData,
      dataLimit: user_data_usage.dataLimit,
      dataUsed: user_data_usage.dataUsed,
      totalSize: fileSizeInBytes,
    };
  }
};

module.exports = async (path, publicKey, network) => {
  try {
    return await getCosting(path, publicKey, network);
  } catch (err) {
    console.log(err);
    return null;
  }
};
