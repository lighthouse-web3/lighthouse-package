/* istanbul ignore file */
const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (e, accessToken) => {
  try {
    const endpoint = lighthouseConfig.lighthouseNode + "/api/v0/add";
    e.persist();
    let mimeType = null;
    if (e.target.files.length === 1) {
      mimeType = e.target.files[0].type;
    }

    const formData = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("file", e.target.files[i]);
    }

    const token = "Bearer " + accessToken;

    const response = await axios.post(endpoint, formData, {
      maxContentLength: "Infinity",
      maxBodyLength: "Infinity",
      headers: {
        "Content-type": `multipart/form-data; boundary= ${formData._boundary}`,
        Encryption: false,
        "Mime-Type": mimeType,
        Authorization: token,
      },
    });

    return response.data;
  } catch {
    return null;
  }
};
