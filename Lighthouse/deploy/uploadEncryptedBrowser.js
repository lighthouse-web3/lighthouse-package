const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");
const { encryptFile } = require("./encryptionBrowser");

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

module.exports = async (e, publicKey, signed_message, file) => {
  try {
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
        const encryptedData = await encryptFile(fileData, "key");
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
    return response.data;
  } catch {
    return null;
  }
};
