const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");
/*
  This function is used to deploy a file to the Lighthouse server.
  It takes the following parameters:
  @param {string} sourcePath - The path of file/folder.
  @param {string} publicKey - The public key of the user.
  @param {string} signedMessage - The signed message for verification.
*/

module.exports = (sourcePath, apiKey) => {
  const fs = eval("require")("fs");
  const NodeFormData = eval("require")("form-data");
  const recursive = eval("require")("recursive-fs");
  const basePathConverter = eval("require")("base-path-converter");
  const token = "Bearer " + apiKey;

  return new Promise((resolve, reject) => {
    const endpoint = lighthouseConfig.node;

    fs.stat(sourcePath, (err, stats) => {
      if (err) {
        reject(err);
      }
      if (stats.isFile()) {
        //we need to create a single read stream instead of reading the directory recursively
        const data = new NodeFormData();

        data.append("file", fs.createReadStream(sourcePath));

        axios
          .post(endpoint, data, {
            withCredentials: true,
            maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
            maxBodyLength: "Infinity",
            headers: {
              "Content-type": `multipart/form-data; boundary= ${data._boundary}`,
              Authorization: token,
            },
          })
          .then(function (result) {
            if (result.status !== 200) {
              reject(
                new Error(
                  `unknown server response while pinning File to IPFS: ${result}`
                )
              );
            }
            resolve(result.data);
          })
          .catch(function (error) {
            console.log(error);
            reject(error);
          });
      } else {
        recursive.readdirr(sourcePath, function (err, dirs, files) {
          if (err) {
            reject(new Error(err));
          }

          let data = new NodeFormData();

          files.forEach((file) => {
            //for each file stream, we need to include the correct relative file path
            data.append("file", fs.createReadStream(file), {
              filepath: basePathConverter(sourcePath, file),
            });
          });

          axios
            .post(endpoint, data, {
              withCredentials: true,
              maxContentLength: "Infinity",
              maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
              headers: {
                "Content-type": `multipart/form-data; boundary= ${data._boundary}`,
                Authorization: token,
              },
            })
            .then(function (result) {
              if (result.status !== 200) {
                reject(
                  new Error(
                    `unknown server response while pinning File to IPFS: ${result}`
                  )
                );
              }

              const temp = result.data.split("\n");
              const response = JSON.parse(temp[temp.length - 2]);
              resolve(response);
            })
            .catch(function (error) {
              reject(error);
            });
        });
      }
    });
  });
};
