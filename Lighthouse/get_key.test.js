const { get_key } = require("./get_key");

test("get_key", async () => {
  const response_key = await get_key(
    "U2FsdGVkX18LETwxINkZdVVfXzyRQ/zacadfyxOESwAIGvX3F+oFagzt43Wf5aFxBB1i/jIY9I6H+8Tj5JJ0JQLdaEOsvNa3Wq6OpIjgNwtxKzjKPmWqDwmib5EjPXuL",
    "ravish"
  );
  const expected_key = {
    privateKey:
      "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895",
    publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
  };

  expect(response_key).toStrictEqual(expected_key);
});
