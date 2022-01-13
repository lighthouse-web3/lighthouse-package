const Conf = require("conf");
const chalk = require("chalk");
const Spinner = require("cli-spinner").Spinner;

const package_config = require("../lighthouse.config");
const { get_balance } = require("../Lighthouse/get_balance");

const config = new Conf();

module.exports = {
  command: "balance",
  desc: "Get current balance of your wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 balance");
      console.log();
      console.log(
        chalk.green("Description: ") + "Get current balance of your wallet"
      );
      console.log();
    } else {
      if (config.get("Lighthouse_publicKey")) {
        const spinner = new Spinner("");
        spinner.start();
        const balance = await get_balance(
          config.get("Lighthouse_publicKey"),
          config.get("Lighthouse_chain")
            ? config.get("Lighthouse_chain")
            : "polygon",
          package_config.network
        );
        spinner.stop();
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        if (balance) {
          console.log(chalk.green("balance " + balance.data * 10 ** -18));
        } else {
          console.log(chalk.red("Something Went Wrong!"));
        }
      } else {
        console.log(chalk.red("Please import wallet first!"));
      }
    }
  },
};
