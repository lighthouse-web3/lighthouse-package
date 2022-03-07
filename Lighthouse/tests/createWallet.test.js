const lighthouse = require("..");

test("createWallet", async () => {
  const wallet = await lighthouse.createWallet("damn");

  expect(wallet).toHaveProperty("privateKey");
  expect(typeof wallet.privateKey).toBe("string");

  expect(wallet).toHaveProperty("publicKey");
  expect(typeof wallet.publicKey).toBe("string");

  expect(wallet).toHaveProperty("privateKeyEncrypted");
  expect(typeof wallet.privateKeyEncrypted).toBe("string");
}, 20000);

test("createWallet null", async () => {
  const wallet = await lighthouse.createWallet(null);
  expect(wallet).toBe(null);
}, 20000);
