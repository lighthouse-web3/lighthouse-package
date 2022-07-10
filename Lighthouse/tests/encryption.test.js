const ethers = require("ethers");
const lighthouse = require("..");

const sign_auth_message = async(publicKey, privateKey) =>{
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const messageRequested = await lighthouse.getAuthMessage(publicKey)
  const signedMessage = await signer.signMessage(messageRequested);
  return(signedMessage)
}

test("fetchEncryptionKey Main Case File", async () => {
  const publicKey = "0xa3c960b3ba29367ecbcaf1430452c6cd7516f588";
  const cid = "QmQF7wqkWUERTqrAE8nBW65si6Cz5poHHh6rRuMt21kaab";

  const signed_message = await sign_auth_message(publicKey, "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a");

  const key = await lighthouse.fetchEncryptionKey(
    cid,
    publicKey,
    signed_message
  );

  expect(typeof key).toBe("string");
}, 60000);

test("fetchEncryptionKey Not Authorized", async () => {
  const publicKey = "0xa3c960b3ba29367ecbcaf1430452c6cd7516f588";
  const cid = "QmQF7wqkWUERTqrAE8nBW65si6Cz5poHHh6rRuMt21kaab";

  const signed_message = "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a";

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
  const cid = "QmQF7wqkWUERTqrAE8nBW65si6Cz5poHHh6rRuMt21kaab";
  const key = "6afaa3e3ef6d40be8cc07156aae00e188b3082938ed34565b99a41e47a5d4ebb";
  const signed_message = await sign_auth_message(publicKey, "0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a");

  const response = await lighthouse.shareFile(
    publicKey,
    "0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD",
    cid,
    key,
    signed_message
  );

  expect(response).toBe("Shared");
}, 60000);

