const axios = require("axios");
const ethers = require("ethers");
const lighthouse = require("..");
const lighthouseConfig = require("../../lighthouse.config");

test("deploy Main Case File", async () => {
  const publicKey = "0xA3C960B3BA29367ecBCAf1430452C6cd7516F588";
  const verificationMessage = (
    await axios.get(
      lighthouseConfig.lighthouseAPI +
        `/api/auth/get_message?publicKey=${publicKey}`
    )
  ).data;
  const provider = new ethers.getDefaultProvider();
  const signer = new ethers.Wallet(
    "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a",
    provider
  );
  const signedMessage = await signer.signMessage(verificationMessage);
  const apiKey = await lighthouse.getApiKey(publicKey, signedMessage);

  const keyPair = await lighthouse.getEncryptionKeyPair(publicKey, apiKey);
  expect(typeof keyPair.publicKey).toBe("string");
}, 60000);

test("getEncryptionKeyPair Invalid Auth", async () => {
  const publicKey = "0xA3C960B3BA29367ecBCAf1430452C6cd7516F588";
  const keyPair = await lighthouse.getEncryptionKeyPair(publicKey, "apiKey");
  expect(keyPair).toBe(null);
}, 20000);

test("decryptPassword main", async () => {
  const fileKey = await lighthouse.decryptPassword(
    "zLSYKVmS/lYdoTnO3u1QL96MXGKCFwoY+47CQK/hnqfENIErZh9GLUwP0IltWkfjHmq5Kg==",
    "rCOizyihaAdmGuzrQdpacQVboV4AE6vB",
    "CFiNS1j2myN4pI3R48CSlc6bXs3DwYF7yJJ6O7KcNQ8=",
    "6AGWK9dVbckocGcSkh4l5INkHKIDrmeRL2I9Wl9sWKM="
  );
  expect(typeof fileKey).toBe("string");
}, 20000);

test("Share main", async () => {
  const publicKey = "0xA3C960B3BA29367ecBCAf1430452C6cd7516F588";
  const verificationMessage = (
    await axios.get(
      lighthouseConfig.lighthouseAPI +
        `/api/auth/get_message?publicKey=${publicKey}`
    )
  ).data;
  const provider = new ethers.getDefaultProvider();
  const signer = new ethers.Wallet(
    "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a",
    provider
  );
  const signedMessage = await signer.signMessage(verificationMessage);
  const apiKey = await lighthouse.getApiKey(publicKey, signedMessage);
  const postData = {
    cid: "QmW5F7WqyDzd6zmC1ex8ooyC7aYjnvcv2eGbZ43n19WgnJ",
    publicKey: "0xA3C960B3BA29367ecBCAf1430452C6cd7516F588",
    fromPublicKey: "0xA3C960B3BA29367ecBCAf1430452C6cd7516F588",
    fileName: "test.jpg",
    nonce: "QwLx0+0cme3qUt3PRQCmsQBbnadC/14L",
    fileSizeInBytes: 82958,
    fileEncryptionKey: "YFpVJ0YMpi9y3DJdNqU/noTB7ktf9lFF9HIobDhp99vgCtgEGkgcHSS4h7KbvKLFEFGJsg==",
    sharedFrom: "7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8=",
    sharedTo: "7x89ojvqRuzvSeK0A3/0KWRVUh36eIHWPadAeFDkIT8="
  };
  
  const response = await axios.post(
    lighthouseConfig.lighthouseAPI + "/api/encryption/save_file_encryption_key",
    postData,
    {headers: { Authorization: `Bearer ${apiKey}` }}
  );

  expect(response.status).toBe(200);
}, 60000);

