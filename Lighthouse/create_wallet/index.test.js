const { create_wallet } = require(".");

test("create_wallet", async () => {
  const wallet = await create_wallet("damn");

  expect(wallet).toHaveProperty("privateKey");
  expect(typeof wallet.privateKey).toBe("string");

  expect(wallet).toHaveProperty("publicKey");
  expect(typeof wallet.publicKey).toBe("string");

  expect(wallet).toHaveProperty("privateKeyEncrypted");
  expect(typeof wallet.privateKeyEncrypted).toBe("string");
}, 20000);
