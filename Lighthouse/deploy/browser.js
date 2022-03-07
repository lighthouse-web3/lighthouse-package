module.exports = async (e, publicKey, signed_message) => {
  return new Promise(function (resolve, reject) {
    e.persist();
    const formData = new FormData();
    formData.append("data", e.target.files[0], e.target.files[0].name);

    const xhr = new XMLHttpRequest();

    xhr.open("POST", "https://node.lighthouse.storage/api/v0/add");

    const token = "Bearer " + publicKey + " " + signed_message;
    xhr.setRequestHeader("Authorization", token);

    xhr.send(formData);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText,
      });
    };
  });
};
