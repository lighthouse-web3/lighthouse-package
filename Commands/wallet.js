const Conf = require("conf");
const chalk = require("chalk");

// const package_config = require("../lighthouse.config");
// const { check_deposit } = require("../Lighthouse/check_deposit");

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
          chalk.yellow("Public Key:    ") + config.get("Lighthouse_publicKey")
        );

        const chain = config.get("Lighthouse_chain")
          ? config.get("Lighthouse_chain")
          : "polygon";
        console.log(chalk.yellow("Current Chain: ") + chain);

        const current_network = config.get("Lighthouse_network")
          ? config.get("Lighthouse_network")
          : "mainnet";
        console.log(chalk.yellow("Network:       ") + current_network);

        // const deposit = await check_deposit();
        // console.log(deposit);
        // console.log(
        //   chalk.yellow("Total Deposit: ") + deposit
        // );
      } else {
        console.log(chalk.red("Please import wallet first!"));
      }
    }
  },
};
