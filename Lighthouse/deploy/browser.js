const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (e, publicKey, signed_message) => {
  try {
    const endpoint = lighthouseConfig.node;
    e.persist();

    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("file", e.target.files[i]);
    }
    const token = "Bearer " + publicKey + " " + signed_message;

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
