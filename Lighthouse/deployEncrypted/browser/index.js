const axios = require("axios");
const lighthouseConfig = require("../../../lighthouse.config");
const { encryptFile } = require("./encryptionBrowser");
const { v4: uuidv4 } = require("uuid");
const nacl = require("tweetnacl");
const util = require("tweetnacl-util");

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

module.exports = async (e, publicKey, signed_message, secretKey) => {
  try {
    // Get users encryption public key
    const encryptionPublicKey = (
      await axios.get(
        lighthouseConfig.URL + `/api/encryption/get_encryption_publicKey?publicKey=${publicKey}`
      )
    ).data.encryptionPublicKey;

    // If no encryption public key throw error
    if (!encryptionPublicKey) {
      throw new Error("Encryption public key not found!!!");
    }

    // Generate fileEncryptionKey
    const fileEncryptionKey = uuidv4().toString();

    // Encrypt fileEncryptionKey
    // const nonce = new Uint8Array(24);
    const nonce = nacl.randomBytes(24);
    const encryptedKey = util.encodeBase64(
      nacl.box(
        util.decodeUTF8(fileEncryptionKey),
        nonce,
        util.decodeBase64(encryptionPublicKey),
        util.decodeBase64(secretKey)
      )
    );
    console.log(encryptedKey);
    if (!encryptedKey) {
      throw new Error("Failed to encrypt key!!!");
    }

    // Upload file
    e.persist();
    const endpoint = lighthouseConfig.node;
    const token = "Bearer " + publicKey + " " + signed_message;

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
    const data = {
      publicKey: publicKey,
      cid: response.data.Hash,
      nonce: util.encodeBase64(nonce),
      fileName: response.data.Name,
      fileSizeInBytes: response.data.Size,
      sharedFrom: encryptionPublicKey,
      sharedTo: encryptionPublicKey,
      fileEncryptionKey: encryptedKey,
    };

    const _ = await axios.post(
      lighthouseConfig.URL + "/api/encryption/save_encryption_key",
      data
    );

    // return response
    return response.data;
  } catch (error) {
    return error.message;
  }
};
