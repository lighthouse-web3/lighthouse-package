const axios = require("axios");

const lighthouseConfig = require("../../lighthouse.config");
const { recoverKey, randSelect } = require("../../Utils/bls_helper");

module.exports = async (
  cid,
  publicKey,
  signedMessage
) => {
  try {
    const nodeIndexSelected = randSelect(3, 5);
    const nodeUrl = nodeIndexSelected.map((elem) =>
      lighthouseConfig.lighthouseBLSNode + "/api/retrieveSharedKey/" + elem
    );

    // send encryption key
    const sentShades = await Promise.all(
      nodeUrl.map((url) => {
        return axios
          .post(
            url,
            {
              address: publicKey,
              cid: cid,
            },
            {
              headers: {
                Authorization: "Bearer " + signedMessage,
              },
            }
          )
          .then((res) => {
            return res.data.payload;
          });
      })
    );

    const keys = sentShades.map((elem) => elem?.key);
    const indexes = sentShades.map((elem) => elem?.index);

    const key = await recoverKey(keys, indexes);
    /*
      return:
        {
          data: {
            key: '519862401c52447c87eb4d41ea5e99f4c6b82a5914cf4086a61f25ef3128122d'
          }
        }
    */
    return {data:{key: key}};
  } catch (error) {
      throw new Error(error.message);
  }
};
