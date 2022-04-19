const lighthouse = require("..");
const { resolve } = require("path");

test("getQuote", async () => {
  const path = resolve(process.cwd(), "Lighthouse/testImages/testImage1.svg");
  const quote = await lighthouse.getQuote(
    path,
    "0x487fc2fE07c593EAb555729c3DD6dF85020B5160"
  );

  expect(quote).toHaveProperty("dataLimit");
  expect(quote).toHaveProperty("dataUsed");
  expect(typeof quote.totalSize).toBe("number");

}, 20000);
