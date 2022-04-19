const { resolve } = require("path");
const lighthouse = require("..");

test("deploy", async () => {
  const path = resolve(process.cwd(), "Lighthouse/testImages/testImage1.svg");
  const deployResponse = await lighthouse.deploy(
    path,
    "ef448a1a-b8cb-4f3a-b967-f2c73be7b239"
  );

  expect(deployResponse).toHaveProperty("Name");
  expect(typeof deployResponse["Name"]).toBe("string");

  expect(deployResponse).toHaveProperty("Hash");
  expect(typeof deployResponse["Hash"]).toBe("string");

  expect(deployResponse).toHaveProperty("Size");
  expect(typeof deployResponse["Size"]).toBe("string");
}, 60000);
