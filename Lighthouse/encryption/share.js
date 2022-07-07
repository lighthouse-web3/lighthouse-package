const axios = require("axios");
const nacl = require("tweetnacl");
const util = require("tweetnacl-util");
const { getKeyShades, randSelect } = require("../../../Utils/bls_helper");
const lighthouseConfig = require("../../lighthouse.config");

module.exports = async (
  publicKeyUserB,
  publicKeyUserA,
  userASecretKey,
  encryptionPublicKeyUserA,
  fileEncryptionKey,
  cid,
  fileName,
  fileSize,
  accessToken
) => {
  try {
    const encryptionPublicKeyUserB = (
      await axios.get(
        lighthouseConfig.URL +
          `/api/encryption/get_encryption_publicKey?publicKey=${publicKeyUserB}`
      )
    ).data.encryptionPublicKey;
    if (!encryptionPublicKeyUserB) {
      throw new Error("User Does not Exist!!!");
    }

    const nonce = nacl.randomBytes(24);
    const encryptedKey = util.encodeBase64(
      nacl.box(
        util.decodeUTF8(fileEncryptionKey),
        nonce,
        util.decodeBase64(encryptionPublicKeyUserB),
        util.decodeBase64(userASecretKey)
      )
    );

    // Save encrypted fileEncryptionKey
    // const data = {
    //   fromPublicKey: publicKeyUserA,
    //   publicKey: publicKeyUserB,
    //   cid: cid,
    //   nonce: util.encodeBase64(nonce),
    //   fileEncryptionKey: encryptedKey,
    //   fileName: fileName,
    //   fileSizeInBytes: fileSize,
    //   sharedFrom: encryptionPublicKeyUserA,
    //   sharedTo: encryptionPublicKeyUserB,
    // };

    // const _ = await axios.post(
    //   lighthouseConfig.URL + "/api/encryption/save_file_encryption_key",
    //   data,
    //   { headers: { Authorization: `Bearer ${accessToken}` } }
    // );

    // shade encryption key
    const { idData, keyShades } = await getKeyShades(fileEncryptionKey);

    // send encryption key
    const sentShades = await Promise.all(
      lighthouseConfig.lighthouseBLSNodes.map((url, index) => {
        return axios.post(
          url,
          {
            address: encryptionPublicKeyUserA,
            cid: cid,
            key: idData[index],
            index: keyShades[index],
            sharedTo: [encryptionPublicKeyUserB],
          },
          {
            headers: {
              Authorization: accessToken,
            },
          }
        );
      })
    );
  } catch (error) {
    return error.message;
  }
};
