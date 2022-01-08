const { restore_keys } = require("../restore_keys");

test("restore_keys", async () => {
  const response_key = await restore_keys(
    "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895",
    "ravish"
  );

  const expected_key = {
    privateKey:
      "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895",
    publicKey: "0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26",
    // privateKeyEncrypted: "U2FsdGVkX18LETwxINkZdVVfXzyRQ/zacadfyxOESwAIGvX3F+oFagzt43Wf5aFxBB1i/jIY9I6H+8Tj5JJ0JQLdaEOsvNa3Wq6OpIjgNwtxKzjKPmWqDwmib5EjPXuL"
  };

  // privateKeyEncrypted cant be strictly matched; encryption changes on every iteration
  expect(response_key).toHaveProperty("privateKeyEncrypted");
  expect(response_key).toMatchObject(expected_key);
});
