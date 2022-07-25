/* istanbul ignore file */
const axios = require("axios");
const ethers = require("ethers");
const { v4: uuidv4 } = require("uuid");

const { getKeyShades } = require("../../../Utils/bls_helper");

const { encryptFile } = require("./encryptionBrowser");
const getAuthMessage = require("../../encryption/getAuthMessage");
const lighthouseConfig = require("../../../lighthouse.config");

const readFileAsync = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      reader.result && resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};

module.exports = async (e, publicKey, accessToken) => {
  try {
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

    // Upload file
    e.persist();
    let mimeType = null;
    if(e.target.files.length === 1){
      mimeType = e.target.files[0].type;
    }
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    const token = "Bearer " + accessToken;

    const fileArr = [];
    for (let i = 0; i < e.target.files.length; i++) {
      fileArr.push(e.target.files[i]);
    }

    const formData = new FormData();
    const filesParam = await Promise.all(
      fileArr.map(async (f) => {
        const fileData = await readFileAsync(f);
        const encryptedData = await encryptFile(fileData, fileEncryptionKey);
        return {
          data: new Blob([encryptedData], { type: f.type }),
          fileName: f.name,
        };
      })
    );
    filesParam.forEach(function (item_) {
      return formData.append(
        "file",
        item_.data,
        item_.fileName ? item_.fileName : "file"
      );
    });

    const response = await axios.post(endpoint, formData, {
      maxContentLength: "Infinity",
      maxBodyLength: "Infinity",
      headers: {
        "Content-type": `multipart/form-data; boundary= ${formData._boundary}`,
        "Encryption": true,
        "Mime-Type": mimeType,
        Authorization: token,
      },
    });

    // sign message
    const messageRequested = await getAuthMessage(publicKey);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signed_message = await signer.signMessage(messageRequested);

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
  } catch (error) {
    return error.message;
  }
};
