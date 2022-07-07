const lighthouseConfig = require("../../lighthouse.config");
const axios = require("axios");
const { recoverKey, randSelect } = require("../../Utils/bls_helper");

module.exports = async (cid, publicKey, accessToken) => {
  const nodeIndexSelected = randSelect(3, 5);
  let nodeUrl = await Promise.all(
    nodeIndexSelected.map((elem) => lighthouseBLSNodesRetrieval[elem])
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
              Authorization: accessToken,
            },
          }
        )
        .then((res) => res.data);
    })
  );
  const keys = sentShades.map((elem) => elem?.key);
  const indexes = sentShades.map((elem) => elem?.index);
  try {
    const key = await recoverKey(keys, indexes);
    return key;
  } catch {
    throw new Error("insufficient Access");
  }
};
