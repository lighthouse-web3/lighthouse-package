const chalk = require("chalk");

const bytesToSize = require("./Utils/byteToSize");
const lighthouse = require("../Lighthouse");

const showResponse = (status) => {
  console.log(
    chalk.yellow("\nCID:") +
      Array(9).fill("\xa0").join("") +
      status[0]["content"]["cid"] +
      chalk.yellow("\nName:") +
      Array(8).fill("\xa0").join("") +
      status[0]["content"]["name"] +
      chalk.yellow("\nSize:") +
      Array(8).fill("\xa0").join("") +
      bytesToSize(status[0]["content"]["size"]) +
      chalk.yellow("\nReplication:") +
      Array(1).fill("\xa0").join("") +
      status[0]["content"]["replication"] +
      "\n"
  );

  for (let i = 0; i < status.length; i++) {
    if (status[i]["deals"].length > 0) {
      console.log(
        Array(20).fill("\xa0").join("") +
          chalk.yellow("Miner : ") +
          Array(10).fill("\xa0").join("") +
          chalk.yellow("DealId: ")
      );

      for (let j = 0; j < status[i]["deals"].length; j++) {
        let gap = 10 + (8 - status[i]["deals"][j]["miner"].length);
        console.log(
          Array(20).fill("\xa0").join("") +
            status[i]["deals"][j]["miner"] +
            Array(gap).fill("\xa0").join("") +
            status[i]["deals"][j]["dealId"]
        );
      }
    } else {
      console.log("CID push to miners in progress.");
    }
    break;
  }
};

module.exports = {
  command: "status <cid>",
  desc: "Get storage status of a CID",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 status <cid>\n" +
          chalk.green("\nDescription: ") +
          "Get storage status of a CID"
      );
    } else {
      const status = await lighthouse.status(argv.cid);

      status
        ? showResponse(status)
        : console.log(chalk.red("Error getting status"));
    }
  },
};
