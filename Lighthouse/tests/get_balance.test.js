const lighthouse = require("../../Lighthouse");

test("get_balance", async () => {
  const balance = await lighthouse.get_balance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "polygon-testnet"
  );

  expect(balance).toHaveProperty("data");
  expect(typeof balance.data).toBe("number");
}, 20000);

test("get_balance", async () => {
  const balance = await lighthouse.get_balance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "fantom-testnet"
  );

  expect(balance).toHaveProperty("data");
  expect(typeof balance.data).toBe("number");
}, 20000);

test("get_balance", async () => {
  const balance = await lighthouse.get_balance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "binance-testnet"
  );

  expect(balance).toHaveProperty("data");
  expect(typeof balance.data).toBe("number");
}, 20000);
