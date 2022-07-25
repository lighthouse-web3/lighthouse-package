/* istanbul ignore file */
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const lighthouseConfig = require("../../../lighthouse.config");

module.exports = async (sourcePath, apiKey, publicKey, signed_message) => {
  try {
    const fs = eval("require")("fs");
    const mime = eval("require")("mime-types");
    const NodeFormData = eval("require")("form-data");
    const { encryptFile } = eval("require")("./encryptionNode");
    const { getKeyShades } = eval("require")("../../../Utils/bls_helper");

    const token = "Bearer " + apiKey;
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    const stats = fs.lstatSync(sourcePath);

    if (stats.isFile()) {
      // Upload file
      const formDdata = new NodeFormData();
      const mimeType = mime.lookup(sourcePath);

      // Generate fileEncryptionKey
      let fileEncryptionKey = null;
      while (fileEncryptionKey === null) {
        try {
          fileEncryptionKey =
            uuidv4().split("-").join("") + uuidv4().split("-").join("");
          let { idData, keyShades } = await getKeyShades(fileEncryptionKey);
        } catch {
          fileEncryptionKey = null;
        }
      }

      // shade encryption key
      const { idData, keyShades } = await getKeyShades(fileEncryptionKey);

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

      const nodeId = [1, 2, 3, 4, 5];
      const nodeUrl = nodeId.map(
        (elem) =>
          lighthouseConfig.lighthouseBLSNode + "/api/setSharedKey/" + elem
      );

      // send encryption key
      const _ = await Promise.all(
        nodeUrl.map((url, index) => {
          return axios
            .post(
              url,
              {
                address: publicKey.toLowerCase(),
                cid: response.data.Hash,
                index: idData[index],
                key: keyShades[index],
              },
              {
                headers: {
                  Authorization: "Bearer " + signed_message,
                },
              }
            )
            .then((res) => res.data);
        })
      );

      // return response
      return response.data;
    } else {
      throw new Error("Directory currently not supported!!!");
    }
  } catch (error) {
    return error.message;
  }
};
