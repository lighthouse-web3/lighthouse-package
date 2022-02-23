const read = require("read");

module.exports = async (options) => {
  return new Promise(function (resolve, reject) {
    read(options, async (err, result) => {
      result ? resolve(result.trim()) : reject(err);
    });
  });
};
