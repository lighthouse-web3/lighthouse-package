const { get_balance } = require("./get_balance");

test("get_balance", async () => {
  const balance = await get_balance(
    "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    "polygon"
  );

  expect(balance).toHaveProperty("data");
  expect(typeof balance.data).toBe("number");
});