const lighthouse = require("../../Lighthouse");

test("get_uploads", async () => {
  const response = await lighthouse.get_uploads(
    "0x487fc2fE07c593EAb555729c3DD6dF85020B5160",
    "fantom"
  );

  expect(typeof response[0]["cid"]).toBe("string");
}, 20000);
