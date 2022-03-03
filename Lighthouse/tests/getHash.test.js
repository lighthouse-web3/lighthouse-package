const fs = require("fs");
const Hash = require("../getHash");
const { resolve } = require("path");

test("getHash", async () => {
  const path = resolve(process.cwd(), "Lighthouse/testImages/testImage1.svg");
  const readStream = fs.createReadStream(path);
  const ipfs_hash = await Hash.of(readStream, {
    cidVersion: 1,
    rawLeaves: true,
    chunker: "rabin",
    minChunkSize: 1048576,
  });

  expect(typeof ipfs_hash).toBe("string");
}, 20000);