/* istanbul ignore file */
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const nacl = require("tweetnacl");
const util = require("tweetnacl-util");

const { encryptFile } = require("./encryptionBrowser");
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
    const fileEncryptionKey = uuidv4().toString();

    // Encrypt fileEncryptionKey
    const nonce = nacl.randomBytes(24);
    const encryptedKey = util.encodeBase64(
      nacl.box(
        util.decodeUTF8(fileEncryptionKey),
        nonce,
        util.decodeBase64(encryptionPublicKey),
        util.decodeBase64(secretKey)
      )
    );

    if (!encryptedKey) {
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
    const data = {
      publicKey: publicKey.toLowerCase(),
      cid: response.data.Hash,
      nonce: util.encodeBase64(nonce),
      fileEncryptionKey: encryptedKey,
      fileName: response.data.Name,
      fileSizeInBytes: response.data.Size,
      sharedFrom: encryptionPublicKey,
      sharedTo: encryptionPublicKey,
    };

    const _ = await axios.post(
      lighthouseConfig.lighthouseAPI +
        "/api/encryption/save_file_encryption_key",
      data,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // return response
    return response.data;
  } catch (error) {
    return error.message;
  }
};
