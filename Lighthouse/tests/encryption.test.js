const ethers = require("ethers");
const lighthouse = require("..");

const signAuthMessage = async (publicKey, privateKey) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const messageRequested = await lighthouse.getAuthMessage(publicKey);
  const signedMessage = await signer.signMessage(messageRequested);
  return signedMessage;
};

test("fetchEncryptionKey Main Case File", async () => {
  const publicKey = "0xa3c960b3ba29367ecbcaf1430452c6cd7516f588";
  const cid = "QmQA5LfUpoyBGcc6E4doYDU7YeWEar4bppfjZ6mB2by7mK";

  const signed_message = await signAuthMessage(
    publicKey,
    "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a"
  );

  const key = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signed_message
  );

  expect(typeof key).toBe("string");
}, 60000);

test("fetchEncryptionKey Not Authorized", async () => {
  const publicKey = "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26";
  const cid = "QmQA5LfUpoyBGcc6E4doYDU7YeWEar4bppfjZ6mB2by7mK";

  const signed_message =
    "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895";

  const key = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signed_message
  );

  expect(key).toBe(null);
}, 60000);

test("getEncryptionKeyPair Invalid Auth", async () => {
  const publicKey = "0xA3C960B3BA29367ecBCAf1430452C6cd7516F588";
  const keyPair = await lighthouse.getEncryptionKeyPair(publicKey, "apiKey");

  expect(keyPair).toBe(null);
}, 20000);

test("getAuthMessage main", async () => {
  const message = await lighthouse.getAuthMessage(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26"
  );

  expect(typeof message).toBe("string");
}, 20000);

test("Share main", async () => {
  const publicKey = "0xa3c960b3ba29367ecbcaf1430452c6cd7516f588";
  const cid = "QmQA5LfUpoyBGcc6E4doYDU7YeWEar4bppfjZ6mB2by7mK";

  const signed_message1 = await signAuthMessage(
    publicKey,
    "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a"
  );

  const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signed_message1
  );

  const signed_message2 = await signAuthMessage(
    publicKey,
    "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a"
  );

  const response = await lighthouse.shareFile(
    publicKey,
    "0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD",
    cid,
    fileEncryptionKey,
    signed_message2
  );

  expect(response).toBe("Shared");
}, 60000);

test("Access Control", async () => {
  const publicKey = "0x4f544A7a285E8B9cc948884acB9Cac4b267bBfc7";
  const cid = "QmS3hKWQRCFHgCQoNFbH6aLi3wSKw4fYqXwJSnG21q94Ar";
  const signedMessage1 = await signAuthMessage(publicKey, "0x8488d2c632da07a93647d7cf701ab6728a884467b1595f3c94007977a20b3539");
  
  // Get File Encryption Key
  const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signedMessage1
  );
  
  expect(typeof fileEncryptionKey).toBe("string");

  // Conditions to add
  const conditions = [
    {
      id: 1,
      chain: "FantomTest",
      method: "balanceOf",
      standardContractType: "ERC20",
      contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
      returnValueTest: { comparator: ">=", value: "0" },
      parameters: [":userAddress"],
    },
    {
      id: 2,
      chain: "FantomTest",
      method: "balanceOf",
      standardContractType: "ERC20",
      contractAddress: "0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1",
      returnValueTest: { comparator: ">=", value: "0" },
      parameters: [":userAddress"],
    },
  ];

  const aggregator = "([1] and [2])";

  const signedMessage2 = await signAuthMessage(publicKey, "0x8488d2c632da07a93647d7cf701ab6728a884467b1595f3c94007977a20b3539");
  const response = await lighthouse.accessCondition(
    publicKey,
    cid,
    fileEncryptionKey,
    signedMessage2,
    conditions,
    aggregator
  );

  // Display response
  expect(response).toBe("Shared");

}, 60000);
