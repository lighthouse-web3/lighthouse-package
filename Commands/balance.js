const Conf = require("conf");
const chalk = require("chalk");
const Spinner = require("cli-spinner").Spinner;

const lighthouse = require("../Lighthouse");
const byteToSize = require("./Utils/byteToSize");

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
                byteToSize(balance.dataLimit) +
                chalk.yellow("\nData Used: ") +
                Array(5).fill("\xa0").join("") +
                byteToSize(balance.dataUsed) +
                chalk.yellow("\nData Remaining: ") +
                byteToSize(
                  parseInt(balance.dataLimit) - parseInt(balance.dataUsed)
                )
            )
          : console.log(chalk.red("Error fetching balance!"));
      } else {
        console.log(chalk.red("Please import wallet first!"));
      }
    }
  },
};
