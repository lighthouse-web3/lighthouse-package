const lighthouse = require("..");

test("getEncryptionKeyPair main", async () => {
  const keyPair = await lighthouse.getEncryptionKeyPair();
  expect(typeof keyPair.publicKey).toBe("string");
}, 20000);

test("decryptPassword main", async () => {
  const fileKey = await lighthouse.decryptPassword(
    "zLSYKVmS/lYdoTnO3u1QL96MXGKCFwoY+47CQK/hnqfENIErZh9GLUwP0IltWkfjHmq5Kg==",
    "rCOizyihaAdmGuzrQdpacQVboV4AE6vB",
    "CFiNS1j2myN4pI3R48CSlc6bXs3DwYF7yJJ6O7KcNQ8=",
    "6AGWK9dVbckocGcSkh4l5INkHKIDrmeRL2I9Wl9sWKM="
  );
  expect(typeof fileKey).toBe("string");
}, 20000);
