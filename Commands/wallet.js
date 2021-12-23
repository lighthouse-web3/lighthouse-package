const chalk = require("chalk");
const Conf = require("conf");
const config = new Conf();

module.exports = {
  command: "wallet",
  desc: "Returns wallet public address",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 wallet");
      console.log();
      console.log(
        chalk.green("Description: ") + "Returns wallet public address"
      );
    } else {
      if (config.get("Lighthouse_publicKey")) {
        console.log(
          chalk.yellow("Public Key: ") + config.get("Lighthouse_publicKey")
        );
      } else {
        console.log(chalk.red("Please import wallet first!"));
      }
    }
  },
};
