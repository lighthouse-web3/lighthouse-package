const lighthouse = require("..");
const { resolve } = require("path");

test("Polygon Chain: getQuote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/testImages/testImage1.svg");
  const quote = await lighthouse.getQuote(
    path,
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "polygon-testnet"
  );

  expect(quote).toHaveProperty("currentBalance");
  expect(typeof Number(quote.currentBalance)).toBe("number");

  expect(quote).toHaveProperty("gasFee");
  expect(typeof quote.gasFee).toBe("number");
}, 20000);

test("Fantom Chain: getQuote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/testImages/testImage1.svg");
  const quote = await lighthouse.getQuote(
    path,
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "fantom-testnet"
  );

  expect(quote.metaData[0]).toHaveProperty("fileSize");
  expect(typeof quote.metaData[0].fileSize).toBe("number");

  expect(quote.metaData[0]).toHaveProperty("mimeType");
  expect(typeof quote.metaData[0].mimeType).toBe("string");
}, 20000);

test("Binance Chain: getQuote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/testImages/testImage1.svg");
  const quote = await lighthouse.getQuote(
    path,
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "binance-testnet"
  );

  expect(quote.metaData[0]).toHaveProperty("fileName");
  expect(typeof quote.metaData[0].fileName).toBe("string");

  expect(quote.metaData[0]).toHaveProperty("cid");
  expect(typeof quote.metaData[0].cid).toBe("string");
}, 20000);
