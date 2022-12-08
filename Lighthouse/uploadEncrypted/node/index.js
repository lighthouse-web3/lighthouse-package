const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const lighthouseConfig = require("../../../lighthouse.config");

module.exports = async (sourcePath, apiKey, publicKey, signed_message) => {
  try {
    const fs = eval("require")("fs");
    const mime = eval("require")("mime-types");
    const NodeFormData = eval("require")("form-data");
    const { encryptFile } = eval("require")("./encryptionNode");
    const { generate, saveShards } = eval("require")("encryption-sdk");

    const token = "Bearer " + apiKey;
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    const stats = fs.lstatSync(sourcePath);

    if (stats.isFile()) {
      // Upload file
      const formDdata = new NodeFormData();
      const mimeType = mime.lookup(sourcePath);

      const { masterKey: fileEncryptionKey, keyShards } = await generate();

      const fileData = fs.readFileSync(sourcePath);
      const encryptedData = await encryptFile(fileData, fileEncryptionKey);
      formDdata.append(
        "file",
        Buffer.from(encryptedData),
        sourcePath.replace(/^.*[\\\/]/, "")
      );

      const response = await axios.post(endpoint, formDdata, {
        withCredentials: true,
        maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
        maxBodyLength: "Infinity",
        headers: {
          "Content-type": `multipart/form-data; boundary= ${formDdata._boundary}`,
          Encryption: true,
          "Mime-Type": mimeType,
          Authorization: token,
        },
      });

      const { isSaved, error } = await saveShards(
        publicKey,
        response.data.Hash,
        signed_message,
        keyShards
      );

      // return response
      /*
        {
          data: {
            Name: 'flow1.png',
            Hash: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
            Size: '31735'
          }
        }
      */
      return { data: response.data, isSaved, error };
    } else {
      throw new Error("Directory currently not supported!!!");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
