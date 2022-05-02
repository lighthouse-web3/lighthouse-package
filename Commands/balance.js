const Conf = require("conf");
const chalk = require("chalk");
const Spinner = require("cli-spinner").Spinner;

const lighthouse = require("../Lighthouse");
const byteToSize = require("../Utils/byteToSize");

const config = new Conf();

module.exports = {
  command: "balance",
  desc: "Get your data usage",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 balance\n" +
          chalk.green("Description: ") +
          "Get data limit and usage of your account.\n"
      );
    } else {
      try {
        if (!config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
          throw new Error("Wallet not created/imported");
        }
        const spinner = new Spinner("");
        spinner.start();

        const balance = await lighthouse.getBalance(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
        );

        spinner.stop();
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        if (!balance) {
          throw new Error("Error fetching balance!");
        }

        console.log(
          chalk.yellow("\nData Limit: ") +
            Array(4).fill("\xa0").join("") +
            byteToSize(parseInt(balance.dataLimit)) +
            chalk.yellow("\nData Used: ") +
            Array(5).fill("\xa0").join("") +
            byteToSize(parseInt(balance.dataUsed)) +
            chalk.yellow("\nData Remaining: ") +
            byteToSize(parseInt(balance.dataLimit) - parseInt(balance.dataUsed))
        );
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
};
