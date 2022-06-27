/* istanbul ignore file */
const axios = require("axios");
const lighthouseConfig = require("../../../lighthouse.config");

module.exports = async (sourcePath, apiKey, publicKey, encryptionPublicKey, fileEncryptionKey, encryptedFileEncryptionKey, nonce) => {
  try {
    const fs = eval("require")("fs");
    const NodeFormData = eval("require")("form-data");
    const { encryptFile } = eval("require")("./encryptionNode");
    const token = "Bearer " + apiKey;
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    const stats = fs.lstatSync(sourcePath);

    if (stats.isFile()) {
      // Upload file
      const formDdata = new NodeFormData();
      
      const fileData = fs.readFileSync(sourcePath);
      const encryptedData = await encryptFile(fileData, fileEncryptionKey);
      formDdata.append("file", Buffer.from(encryptedData), sourcePath.replace(/^.*[\\\/]/, ''));

      const response = await axios.post(endpoint, formDdata, {
        withCredentials: true,
        maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
        maxBodyLength: "Infinity",
        headers: {
          "Content-type": `multipart/form-data; boundary= ${formDdata._boundary}`,
          Authorization: token,
        },
      });

      // Save encrypted fileEncryptionKey
      const data = {
        publicKey: publicKey.toLowerCase(),
        cid: response.data.Hash,
        nonce: nonce,
        fileEncryptionKey: encryptedFileEncryptionKey,
        fileName: response.data.Name,
        fileSizeInBytes: response.data.Size,
        sharedFrom: encryptionPublicKey,
        sharedTo: encryptionPublicKey,
      };
      
      const _ = await axios.post(
        lighthouseConfig.lighthouseAPI +
          "/api/encryption/save_file_encryption_key",
        data,
        { headers: { Authorization: token } }
      );

      // return response
      return response.data;
    } else{
      throw new Error("Directory currently not supported!!!");
    }
  } catch (error) {
    console.log(error)
    return error.message;
  }
};
