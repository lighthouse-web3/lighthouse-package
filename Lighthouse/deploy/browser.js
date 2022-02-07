const axios = require("axios");

const lighthouse_config = require("../../lighthouse.config");

const user_token = async (expiry_time) => {
  try {
    const body = {
      expiry_time: expiry_time,
    };
    const response = await axios.post(
      lighthouse_config.URL + `/api/lighthouse/user_token`,
      body
    );

    return response.data;
  } catch (e) {
    return null;
  }
};

module.exports = async (e) => {
  const upload_token = await user_token("24h");
  return new Promise(function (resolve, reject) {
    e.persist();
    const formData = new FormData();
    formData.append("data", e.target.files[0], e.target.files[0].name);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://shuttle-4.estuary.tech/content/add");
    xhr.setRequestHeader("Authorization", `Bearer ${upload_token.token}`);

    xhr.send(formData);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
            status: xhr.status,
            statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
          status: xhr.status,
          statusText: xhr.statusText
      });
    };
  });
};
