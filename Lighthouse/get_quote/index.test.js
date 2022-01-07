const { get_quote } = require(".");
const { resolve } = require("path");

test("Polygon Chain: get_quote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/get_quote/test_image.png");
  const quote = await get_quote(
    path,
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "polygon",
    "testnet"
  );
  
  expect(quote).toHaveProperty("current_balance");
  expect(typeof quote.current_balance).toBe("number");

  expect(quote).toHaveProperty("gasFee");
  expect(typeof quote.gasFee).toBe("number");
}, 20000);

test("Fantom Chain: get_quote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/get_quote/test_image.png");
  const quote = await get_quote(
    path,
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "fantom",
    "testnet"
  );
  
  expect(quote).toHaveProperty("file_size");
  expect(typeof quote.file_size).toBe("number");

  expect(quote).toHaveProperty("mime_type");
  expect(typeof quote.mime_type).toBe("string");
}, 20000);

test("Binance Chain: get_quote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/get_quote/test_image.png");
  const quote = await get_quote(
    path,
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "binance",
    "testnet"
  );
  
  expect(quote).toHaveProperty("file_name");
  expect(typeof quote.file_name).toBe("string");

  expect(quote).toHaveProperty("ipfs_hash");
  expect(typeof quote.ipfs_hash).toBe("string");
}, 20000);
