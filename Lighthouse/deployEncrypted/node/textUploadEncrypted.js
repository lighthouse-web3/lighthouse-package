/* istanbul ignore file */
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const NodeFormData = eval("require")("form-data");
const { encryptFile } = eval("require")("./encryptionNode");
const { getKeyShades } = eval("require")("../../../Utils/bls_helper");

const lighthouseConfig = require("../../../lighthouse.config");

module.exports = async (text, apiKey, publicKey, signed_message) => {
  try {
    const token = "Bearer " + apiKey;
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    
    // Upload file
    const formDdata = new NodeFormData();

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

    const encryptedData = await encryptFile(Buffer.from(text), fileEncryptionKey);
    
    formDdata.append(
      "file",
      Buffer.from(encryptedData)
    );

    const response = await axios.post(endpoint, formDdata, {
      withCredentials: true,
      maxContentLength: "Infinity", //this is needed to prevent axios from erroring out with large directories
      maxBodyLength: "Infinity",
      headers: {
        "Content-type": `multipart/form-data; boundary= ${formDdata._boundary}`,
        "Encryption": true,
        "Mime-Type": "text/plain",
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
              payload: {
                index: idData[index],
                key: keyShades[index]
              }
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

    return response.data;
  } catch (error) {
    return error.message;
  }
};
