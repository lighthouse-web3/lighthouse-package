const fs = require("fs");
const Hash = require("../get_hash");
const { resolve } = require("path");

test("get_hash", async () => {
  const path = resolve(process.cwd(), "Lighthouse/test_images/test_image1.png");
  const readStream = fs.createReadStream(path);
  const ipfs_hash = await Hash.of(readStream, {
    cidVersion: 1,
    rawLeaves: true,
    chunker: "rabin",
    minChunkSize: 1048576,
  });

  expect(typeof ipfs_hash).toBe("string");
}, 20000);
