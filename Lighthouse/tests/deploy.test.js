const axios = require("axios");
const ethers = require("ethers");
const package_config = require("../../config.json");
const { lighthouseAbi } = require("../contract_abi/lighthouseAbi");

/*
  Functions are rewritten in this file since jest is showing error in importing fileFromPath dependency
*/
const user_token = async (signer, chain, expiry_time, network = "testnet") => {
  try {
    const body = {
      network: network,
      signer: signer,
      expiry_time: expiry_time,
      chain: chain,
    };
    const response = await axios.post(
      package_config.URL + `/api/lighthouse/user_token`,
      body
    );

    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const push_cid_tochain = async (signer, cid, chain, network) => {
  try {
    const contract = new ethers.Contract(
      package_config[network][chain]["lighthouse_contract_address"],
      lighthouseAbi,
      signer
    );

    const txResponse = await contract.store(
      cid,
      {} //,
      // { value: ethers.utils.parseEther(req.body.cost) }
    );

    const txReceipt = await txResponse.wait();
    return txReceipt;
  } catch (e) {
    console.log(e);
    return null;
  }
};

test("user_token", async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    package_config["mainnet"]["polygon"]["rpc"]
  );
  const signer = new ethers.Wallet(
    "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895",
    provider
  );

  const token = await user_token(signer, "polygon", "1h", "mainnet");

  expect(token).toHaveProperty("token");
  expect(typeof token.token).toBe("string");
}, 30000);

test("push_cid_tochain", async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    package_config["testnet"]["polygon"]["rpc"]
  );
  const signer = new ethers.Wallet(
    "0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895",
    provider
  );

  const tx = await push_cid_tochain(
    signer,
    "QmTMBh4bCQFgzr1fTCjVb5pRBUe7v9673HTLZWh77sUHUx",
    "polygon",
    "testnet"
  );

  expect(tx).toHaveProperty("transactionHash");
  expect(typeof tx.transactionHash).toBe("string");
}, 30000);
