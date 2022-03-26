const Conf = require("conf");
const chalk = require("chalk");
const Spinner = require("cli-spinner").Spinner;

const lighthouse = require("../Lighthouse");

const config = new Conf();

module.exports = {
  command: "balance",
  desc: "Get current balance of your wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 balance\n" +
          chalk.green("Description: ") +
          "Get data limit and usage of your account.\n"
      );
    } else {
      if (config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
        const spinner = new Spinner("");
        spinner.start();

        const balance = await lighthouse.getBalance(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
        );

        spinner.stop();
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        balance
          ? console.log(
              chalk.yellow("\nData Limit: ") +
              Array(4).fill("\xa0").join("") +
              balance.dataLimit.toFixed(8) + " GB" +
              chalk.yellow("\nData Used: ") +
              Array(5).fill("\xa0").join("") +
              balance.dataUsed.toFixed(8) + " GB" +
              chalk.yellow("\nData Remaining: ") +
              (balance.dataLimit - balance.dataUsed).toFixed(8) + " GB"
            )
          : console.log(chalk.red("Error fetching balance!"));
      } else {
        console.log(chalk.red("Please import wallet first!"));
      }
    }
  },
};
