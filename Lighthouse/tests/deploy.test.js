const axios = require("axios");
const ethers = require("ethers");
const { resolve } = require("path");
const lighthouse = require("../../Lighthouse");
const lighthouse_config = require("../../lighthouse.config");

test("deploy", async () => {
  const path = resolve(process.cwd(), "Lighthouse/test_images/test_image1.svg");
  const network = "fantom-testnet";
  const provider = new ethers.providers.JsonRpcProvider(
    lighthouse_config[network]["rpc"]
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
  const signed_message = await signer.signMessage(message);

  const deployResponse = await lighthouse.deploy(
    path,
    signer,
    false,
    signed_message,
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
