const chalk = require("chalk");
const Lighthouse = require("../Lighthouse");

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
        chalk.yellow("CID        : ") + response[0]["content"]["cid"]
      );
      console.log(
        chalk.yellow("Name       : ") + response[0]["content"]["name"]
      );
      console.log(
        chalk.yellow("Replication: ") + response[0]["content"]["replication"]
      );
      console.log();
    }
  },
};
