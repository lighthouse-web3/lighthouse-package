const axios = require("axios");
const ethers = require("ethers");
const { resolve } = require("path");
const lighthouse = require("../../Lighthouse");
const lighthouseConfig = require("../../lighthouse.config");

test("deploy", async () => {
  const path = resolve(process.cwd(), "Lighthouse/testImages/testImage1.svg");
  const network = "fantom-testnet";
  const provider = new ethers.providers.JsonRpcProvider(
    lighthouseConfig[network]["rpc"]
  );
  const signer = new ethers.Wallet(
    "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895",
    provider
  );

  const publicKey = await signer.getAddress();

  const message = (
    await axios.get(
      `https://api.lighthouse.storage/api/lighthouse/get_message?publicKey=${publicKey}`
    )
  ).data;
  const signedMessage = await signer.signMessage(message);

  const deployResponse = await lighthouse.deploy(
    path,
    signer,
    false,
    signedMessage,
    publicKey,
    network
  );

  expect(deployResponse).toHaveProperty("Name");
  expect(typeof deployResponse["Name"]).toBe("string");

  expect(deployResponse).toHaveProperty("Hash");
  expect(typeof deployResponse["Hash"]).toBe("string");

  expect(deployResponse).toHaveProperty("Size");
  expect(typeof deployResponse["Size"]).toBe("string");

  expect(deployResponse["txObj"]).toHaveProperty("transactionHash");
  expect(typeof deployResponse["txObj"]["transactionHash"]).toBe("string");
}, 60000);
