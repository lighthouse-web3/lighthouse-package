const lighthouse = require("../../Lighthouse");
const { resolve } = require("path");

test("Polygon Chain: get_quote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/test_images/test_image1.svg");
  const quote = await lighthouse.get_quote(
    path,
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "polygon-testnet"
  );

  expect(quote).toHaveProperty("current_balance");
  expect(typeof Number(quote.current_balance)).toBe("number");

  expect(quote).toHaveProperty("gasFee");
  expect(typeof quote.gasFee).toBe("number");
}, 20000);

test("Fantom Chain: get_quote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/test_images/test_image1.svg");
  const quote = await lighthouse.get_quote(
    path,
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "fantom-testnet"
  );

  expect(quote.meta_data[0]).toHaveProperty("file_size");
  expect(typeof quote.meta_data[0].file_size).toBe("number");

  expect(quote.meta_data[0]).toHaveProperty("mime_type");
  expect(typeof quote.meta_data[0].mime_type).toBe("string");
}, 20000);

test("Binance Chain: get_quote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/test_images/test_image1.svg");
  const quote = await lighthouse.get_quote(
    path,
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "binance-testnet"
  );

  expect(quote.meta_data[0]).toHaveProperty("file_name");
  expect(typeof quote.meta_data[0].file_name).toBe("string");

  expect(quote.meta_data[0]).toHaveProperty("cid");
  expect(typeof quote.meta_data[0].cid).toBe("string");
}, 20000);
