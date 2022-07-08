/* istanbul ignore file */
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const lighthouseConfig = require("../../../lighthouse.config");

module.exports = async (sourcePath, apiKey, publicKey, signed_message) => {
  try {
    const fs = eval("require")("fs");
    const NodeFormData = eval("require")("form-data");
    const { encryptFile } = eval("require")("./encryptionNode");
    const { getKeyShades } = eval("require")("../../../Utils/bls_helper");

    const token = "Bearer " + apiKey;
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    const stats = fs.lstatSync(sourcePath);

    if (stats.isFile()) {
      // Upload file
      const formDdata = new NodeFormData();
      
      // Generate fileEncryptionKey
      let fileEncryptionKey = null;
      while(fileEncryptionKey===null){
        try{
          fileEncryptionKey = uuidv4().split("-").join("") + uuidv4().split("-").join("");
          let {idData, keyShades} = await getKeyShades(
            fileEncryptionKey
          );
        } catch{
          fileEncryptionKey = null;
        }
      }

      // shade encryption key
      const { idData, keyShades } = await getKeyShades(
        fileEncryptionKey
      );

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

      // send encryption key
    const _ = await Promise.all(
      lighthouseConfig.lighthouseBLSNodes.map((url, index) => {
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
    } else{
      throw new Error("Directory currently not supported!!!");
    }
  } catch (error) {
    console.log(error)
    return error.message;
  }
};
