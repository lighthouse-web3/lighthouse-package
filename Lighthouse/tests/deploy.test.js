require("dotenv").config();
const axios = require("axios");
const { resolve } = require("path");
const ethers = require("ethers");
const lighthouse = require("../");
const lighthouseConfig = require("../../lighthouse.config");

test("deploy Main Case File", async () => {
  const path = resolve(process.cwd(), "Utils/testImages/testImage1.svg");

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

  const deployResponse = await lighthouse.deploy(path, apiKey);

  expect(deployResponse).toHaveProperty("Name");
  expect(typeof deployResponse["Name"]).toBe("string");

  expect(deployResponse).toHaveProperty("Hash");
  expect(typeof deployResponse["Hash"]).toBe("string");

  expect(deployResponse).toHaveProperty("Size");
  expect(typeof deployResponse["Size"]).toBe("string");
}, 60000);

test("deploy Main Case Folder", async () => {
  const path = resolve(process.cwd(), "Utils/testImages");

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

  const deployResponse = await lighthouse.deploy(path, apiKey);

  expect(deployResponse).toHaveProperty("Name");
  expect(typeof deployResponse["Name"]).toBe("string");

  expect(deployResponse).toHaveProperty("Hash");
  expect(typeof deployResponse["Hash"]).toBe("string");

  expect(deployResponse).toHaveProperty("Size");
  expect(typeof deployResponse["Size"]).toBe("string");
}, 60000);

test("deploy Error Case Wrong Path", async () => {
  const path = resolve(process.cwd(), "Utils/testImages/testImage2.svg");
  const deployResponse = await lighthouse.deploy(path, "apiKey");
  expect(typeof deployResponse).toBe("string");
}, 60000);

test("deploy Error Case Wrong Api Key File", async () => {
  const path = resolve(process.cwd(), "Utils/testImages/testImage1.svg");
  const deployResponse = await lighthouse.deploy(path, "apiKey");
  expect(deployResponse).toBe("Request failed with status code 500");
}, 60000);

test("deploy Error Case Wrong Api Key Folder", async () => {
  const path = resolve(process.cwd(), "Utils/testImages");
  const deployResponse = await lighthouse.deploy(path, "apiKey");
  expect(deployResponse).toBe("Request failed with status code 500");
}, 60000);
