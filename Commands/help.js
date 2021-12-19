const chalk = require("chalk");

module.exports = {
  command: "$0",
  handler: async function (argv) {
    console.log(chalk.yellow("Welcome to lighthouse-web3"));
    console.log();
    console.log(
      "Usage: lighthouse-web3" +
        chalk.cyan(" [command] ") +
        chalk.green("[options]")
    );
    console.log();
    console.log(
      chalk.green("Commands (alias)") +
        chalk.grey("                     Description")
    );
    console.log(
      "create-wallet   " + "                     Creates a new wallet"
    );
    console.log(
      "import-wallet   " + "                     Import an existing wallet"
    );
    console.log(
      "wallet-forget   " + "                     Remove previously saved wallet"
    );
    console.log(
      "balance         " +
        "                     Get current balance of your wallet"
    );
    console.log(
      "deploy          " + "                     Deploy a directory or file"
    );
    console.log(
      "status          " +
        "                     Get metadata around the storage per CID"
    );
    console.log();
    console.log(chalk.cyan("Options"));
    console.log(
      "--save          " +
        "                     Saves the wallet after creation"
    );
    console.log();
    console.log(chalk.magenta("Example"));
    console.log("Create wallet and save it");
    console.log("   lighthouse-web3 create-wallet --save");
    console.log();
    console.log("Import wallet");
    console.log("   lighthouse-web3 import-wallet --path wallet.json");
    console.log();
  }
};
