const lighthouse = require("../../Lighthouse");

test("getBalance polygon-testnet", async () => {
  const balance = await lighthouse.getBalance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "polygon-testnet"
  );

  expect(typeof balance).toBe("string");
}, 20000);

test("getBalance fantom-testnet", async () => {
  const balance = await lighthouse.getBalance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "fantom-testnet"
  );

  expect(typeof balance).toBe("string");
}, 20000);

test("getBalance binance-testnet", async () => {
  const balance = await lighthouse.getBalance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "binance-testnet"
  );

  expect(typeof balance).toBe("string");
}, 20000);

test("getBalance polygon", async () => {
  const balance = await lighthouse.getBalance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "polygon"
  );

  expect(typeof balance).toBe("string");
}, 20000);

test("getBalance fantom", async () => {
  const balance = await lighthouse.getBalance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "fantom"
  );

  expect(typeof balance).toBe("string");
}, 20000);

test("getBalance binance", async () => {
  const balance = await lighthouse.getBalance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "binance"
  );

  expect(typeof balance).toBe("string");
}, 20000);

test("getBalance null case", async () => {
  const balance = await lighthouse.getBalance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    null
  );

  expect(balance).toBe(null);
}, 20000);
