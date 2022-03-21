const axios = require("axios");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (e, publicKey, signed_message, file) => {
  try {
    const endpoint = lighthouseConfig.node;
    if (file) {
      e.persist();

      const formData = new FormData();
      formData.append("data", e.target.files[0], e.target.files[0].name);

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
    } else {
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
    }
  } catch {
    return null;
  }
};
