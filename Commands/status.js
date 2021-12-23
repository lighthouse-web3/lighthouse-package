const chalk = require("chalk");
const Lighthouse = require("../Lighthouse");
const { bytesToSize } = require("./byteToSize");

module.exports = {
  command: "status <cid>",
  desc: "Get metadata around the storage per CID",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 status <cid>");
      console.log();
      console.log(
        chalk.green("Description: ") + "Get metadata around the storage per CID"
      );
    } else {
      const response = await Lighthouse.status(argv.cid);
      console.log();
      console.log(
        chalk.yellow("CID:") +
          Array(9).fill("\xa0").join("") +
          response[0]["content"]["cid"]
      );
      console.log(
        chalk.yellow("Name:") +
          Array(8).fill("\xa0").join("") +
          response[0]["content"]["name"]
      );
      console.log(
        chalk.yellow("Size:") +
          Array(8).fill("\xa0").join("") +
          bytesToSize(response[0]["content"]["size"])
      );
      console.log(
        chalk.yellow("Replication:") +
          Array(1).fill("\xa0").join("") +
          response[0]["content"]["replication"]
      );
      console.log();

      for (let i = 0; i < response.length; i++) {
        if (response[i]["deals"].length > 0) {
          console.log(
            Array(20).fill("\xa0").join("") +
              chalk.yellow("Miner : ") +
              Array(10).fill("\xa0").join("") +
              chalk.yellow("DealId: ")
          );
          for (let j = 0; j < response[i]["deals"].length; j++) {
            let gap = 10 + (8 - response[i]["deals"][j]["miner"].length);
            console.log(
              Array(20).fill("\xa0").join("") +
                response[i]["deals"][j]["miner"] +
                Array(gap).fill("\xa0").join("") +
                response[i]["deals"][j]["dealId"]
            );
          }
        } else {
          console.log("CID push to filecoin network in progress.");
        }
        break;
      }
    }
  },
};
