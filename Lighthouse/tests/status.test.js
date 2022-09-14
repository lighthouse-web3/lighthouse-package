const lighthouse = require("../../Lighthouse");

test("status", async () => {
  const response = (await lighthouse.status(
    "bafkreia4ruswe7ghckleh3lmpujo5asrnd7hrtu5r23zjk2robpcoend34"
  )).data.status;

  expect(typeof response[0]["content"]["cid"]).toBe("string");
  expect(typeof response[0]["content"]["name"]).toBe("string");
  expect(typeof response[0]["content"]["size"]).toBe("number");
}, 20000);

test("status null case", async () => {
  try{
    const response = await lighthouse.status(null);
    expect(response).toBe(null);
  } catch(error){
    expect(typeof error.message).toBe("string");
  }
  
}, 20000);
