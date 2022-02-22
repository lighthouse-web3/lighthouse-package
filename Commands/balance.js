const Conf = require("conf");
const chalk = require("chalk");
const Spinner = require("cli-spinner").Spinner;

const lighthouse = require("../Lighthouse");
const lighthouse_config = require("../lighthouse.config");

const config = new Conf();

module.exports = {
  command: "balance",
  desc: "Get current balance of your wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 balance\n");
      console.log(
        chalk.green("Description: ") + "Get current balance of your wallet\n"
      );
    } else {
      if (config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
        const spinner = new Spinner("");
        spinner.start();

        const balance = await lighthouse.get_balance(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          config.get("LIGHTHOUSE_GLOBAL_NETWORK")
            ? config.get("LIGHTHOUSE_GLOBAL_NETWORK")
            : lighthouse_config.network
        );

        spinner.stop();
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        
        balance
          ? console.log(chalk.green("balance " + balance))
          : console.log(chalk.red("Error fetching balance!"));
      } else {
        console.log(chalk.red("Please import wallet first!"));
      }
    }
  },
};
