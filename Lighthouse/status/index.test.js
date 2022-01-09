const { status } = require(".");

test("status", async () => {
  const response = await status(
    "bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34"
  );

  expect(typeof response[0]["content"]["cid"]).toBe("string");
  expect(typeof response[0]["content"]["name"]).toBe("string");
  expect(typeof response[0]["content"]["size"]).toBe("number");
}, 20000);
