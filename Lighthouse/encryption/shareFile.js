const { shareToAddress } = require("@lighthouse-web3/kavach");

module.exports = async (publicKey, shareTo, cid, signedMessage) => {
  try {
    const { isSuccess, error } = await shareToAddress(
      publicKey,
      cid,
      signedMessage,
      shareTo
    );

    if (error) {
      throw new Error(error);
    }

    /*
      {
        data: {
          cid: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
          shareTo: [ '0x487fc2fE07c593EAb555729c3DD6dF85020B5160' ],
          status: "Success"
        }
      }
    */
    return { data: { cid, shareTo, status: "Success" } };
  } catch (error) {
    throw new Error(error);
  }
};
