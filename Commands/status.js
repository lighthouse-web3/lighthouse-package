const chalk = require("chalk");
const bytesToSize = require("../Utils/byteToSize");
const lighthouse = require("../Lighthouse");
const { isCID } = require("../Utils/util");

const showResponse = (status) => {
  console.log(
    chalk.yellow("\r\nCID:") +
      Array(9).fill("\xa0").join("") +
      status[0]["content"]["cid"] +
      chalk.yellow("\r\nName:") +
      Array(8).fill("\xa0").join("") +
      status[0]["content"]["name"] +
      chalk.yellow("\r\nSize:") +
      Array(8).fill("\xa0").join("") +
      bytesToSize(status[0]["content"]["size"]) +
      chalk.yellow("\r\nReplication:") +
      Array(1).fill("\xa0").join("") +
      status[0]["content"]["replication"] +
      "\r\n"
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
  command: "status [cid]",
  desc: "Get storage status of a CID",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 status <cid>\r\n" +
          chalk.green("\r\nDescription: ") +
          "Get storage status of a CID"
      );
    } else {
      try {
        const status = (await lighthouse.status(argv.cid)).data.status;
        showResponse(status);
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
  builder: function (yargs) {
    yargs
      .option("c", {
        alias: "cid",
        demandOption: true,
        describe: "file CID",
        type: "string",
      })
      .help()
      .check((argv, options) => {
        if (!isCID(argv.cid)) {
          console.log(chalk.red("Invalid CID"));
          throw new Error("Invalid CID");
        }
        return true;
      });
  },
};
