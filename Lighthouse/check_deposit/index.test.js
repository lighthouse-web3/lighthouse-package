
const { check_deposit } = require(".");

test("check_deposit", async () => {
  const deposit = await check_deposit("0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26", "polygon", "testnet");
  
  expect(typeof deposit).toBe("number");
}, 30000);