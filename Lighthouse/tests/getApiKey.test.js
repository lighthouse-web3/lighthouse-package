const axios = require("axios");
const ethers = require("ethers");
const lighthouse = require("..");
const lighthouseConfig = require("../../lighthouse.config");

test("getApiKey Main Case", async () => {
  const publicKey = "0xA3C960B3BA29367ecBCAf1430452C6cd7516F588";
  const verificationMessage = (
    await axios.get(
      lighthouseConfig.URL + `/api/auth/get_message?publicKey=${publicKey}`
    )
  ).data;
  const provider = new ethers.getDefaultProvider();
  const signer = new ethers.Wallet(
    "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a",
    provider
  );
  const signedMessage = await signer.signMessage(verificationMessage);

  const apiKey = await lighthouse.getApiKey(publicKey, signedMessage);

  expect(typeof apiKey).toBe("string");
}, 60000);

test("getApiKey Null Case", async () => {
  const publicKey = "0xA3C960B3BA29367ecBCAf1430452C6cd7516F588";
  const apiKey = await lighthouse.getApiKey(publicKey, "signedMessage");

  expect(typeof apiKey).toBe(null);
}, 60000);
