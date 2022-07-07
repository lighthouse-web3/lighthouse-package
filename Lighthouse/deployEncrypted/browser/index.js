/* istanbul ignore file */
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { getKeyShades, randSelect } = require("./helper");
const { encryptFile } = require("./encryptionBrowser");
const encryptKey = require("../../encryption/encryptKey");
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

module.exports = async (e, accessToken, secretKey, publicKey) => {
  try {
    // Get users encryption public key
    const encryptionPublicKey = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/encryption/get_encryption_publicKey?publicKey=${publicKey}`
      )
    ).data.encryptionPublicKey;

    // If no encryption public key throw error
    if (!encryptionPublicKey) {
      throw new Error("Encryption public key not found!!!");
    }

    // Generate fileEncryptionKey
    const fileEncryptionKey = `${uuidv4()
      .toString()
      .split("-")
      .join("")}${uuidv4().toString().split("-").join("")}`;

    // Encrypt fileEncryptionKey
    const encryptedKey = encryptKey(
      fileEncryptionKey,
      encryptionPublicKey,
      secretKey
    );

    if (!encryptedKey.encryptedFileEncryptionKey) {
      throw new Error("Failed to encrypt key!!!");
    }

    // Upload file
    e.persist();
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
        Authorization: token,
      },
    });

    // Save encrypted fileEncryptionKey
    // const data = {
    //   publicKey: publicKey.toLowerCase(),
    //   cid: response.data.Hash,
    //   nonce: encryptedKey.nonce,
    //   fileEncryptionKey: encryptedKey.encryptedFileEncryptionKey,
    //   fileName: response.data.Name,
    //   fileSizeInBytes: response.data.Size,
    //   sharedFrom: encryptionPublicKey,
    //   sharedTo: encryptionPublicKey,
    // };

    // shade encryption key
    const { idData, keyShades } = await getKeyShades(
      encryptedKey.encryptedFileEncryptionKey
    );

    // Todo: sign message
    const messageRequested = await axios.post(
      lighthouseConfig.lighthouseBLSAuthNode +
        `api/message/${publicKey.toLowerCase()}`,
      data
    );

    // send encryption key
    const sentShades = await Promise.all(
      lighthouseConfig.lighthouseBLSNodes.map((url, index) => {
        return axios.post(
          url,
          {
            address: publicKey.toLowerCase(),
            cid: response.data.Hash,
            key: idData[index],
            index: keyShades[index],
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
      })
    );

    // return response
    return sentShades.data;
  } catch (error) {
    return error.message;
  }
};
