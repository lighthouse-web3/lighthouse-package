const lighthouse = require("..");

test("createWallet", async () => {
  const encryptedWallet = JSON.parse(await lighthouse.createWallet("Uchihas"));
  expect(encryptedWallet).toHaveProperty("address");
}, 20000);

test("createWallet null", async () => {
  const wallet = await lighthouse.createWallet(null);
  expect(wallet).toBe(null);
}, 20000);
