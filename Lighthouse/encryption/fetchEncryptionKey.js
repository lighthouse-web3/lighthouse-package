const axios = require("axios");

const lighthouseConfig = require("../../lighthouse.config");
const { recoverKey, recoverShards } = require("encryption-sdk");

module.exports = async (cid, publicKey, signedMessage) => {
  try {
    const { error, shards } = await recoverShards(
      publicKey,
      cid,
      signedMessage
    );
    if (error) {
      throw new Error(error);
    }
    const { masterKey: key, error: recoverError } = await recoverKey(shards);

    if (recoverError) {
      throw new Error(recoverError);
    }
    /*
      return:
        {
          data: {
            key: '519862401c52447c87eb4d41ea5e99f4c6b82a5914cf4086a61f25ef3128122d'
          }
        }
    */
    return { data: { key: key } };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
