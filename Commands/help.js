const chalk = require("chalk");
const packageJson = require("package-json");
const { version } = require("../package.json");
const Conf = require("conf");
const config = new Conf();

module.exports = {
  command: "$0",
  builder: {
    chain: {
      describe: "Chain to use, delault: polygon",
      type: "String",
    },
  },
  handler: async function (argv) {
    if (argv.chain) {
      if (argv.chain.toString().toLowerCase() === "polygon") {
        config.set("Lighthouse_chain", "polygon");
        console.log(chalk.green("Chain set to polygon"));
      } else if (argv.chain.toString().toLowerCase() === "fantom") {
        config.set("Lighthouse_chain", "fantom");
        console.log(chalk.green("Chain set to fantom"));
      } else if (argv.chain.toString().toLowerCase() === "binance") {
        config.set("Lighthouse_chain", "binance");
        console.log(chalk.green("Chain set to binance"));
      } else {
        config.set("Lighthouse_chain", "polygon");
        console.log(chalk.green("Chain set to polygon"));
      }
    } else {
      console.log(chalk.yellow("Welcome to lighthouse-web3\n"));
      console.log(
        "Usage: lighthouse-web3" +
          chalk.cyan(" [command] ") +
          chalk.green("[options]\n")
      );
      console.log(
        chalk.green("Commands (alias)") +
          chalk.grey(Array(21).fill("\xa0").join("") + "Description")
      );
      console.log(
        "wallet" +
          Array(31).fill("\xa0").join("") +
          "Returns wallet public address"
      );
      console.log(
        "create-wallet" +
          Array(24).fill("\xa0").join("") +
          "Creates a new wallet"
      );
      console.log(
        "import-wallet" +
          Array(24).fill("\xa0").join("") +
          "Import an existing wallet"
      );
      console.log(
        "wallet-forget" +
          Array(24).fill("\xa0").join("") +
          "Remove previously saved wallet"
      );
      console.log(
        "balance" +
          Array(30).fill("\xa0").join("") +
          "Get current balance of your wallet"
      );
      console.log("deploy" + Array(31).fill("\xa0").join("") + "Deploy a file");
      console.log(
        "status" +
          Array(31).fill("\xa0").join("") +
          "Get metadata around the storage per CID\n"
      );
      console.log(chalk.cyan("Options"));
      console.log(
        "--chain" +
          Array(30).fill("\xa0").join("") +
          "Change network chain\n"
      );
      console.log(
        "--save" +
          Array(31).fill("\xa0").join("") +
          "Saves the wallet after creation\n"
      );
      console.log(
        "--help" +
          Array(31).fill("\xa0").join("") +
          "Help for a specific command command\n"
      );
      console.log(chalk.magenta("Example"));
      console.log("Change Network");
      console.log(
        Array(5).fill("\xa0").join("") +
          "lighthouse-web3 --chain polygon\n"
      );
      console.log(
        Array(5).fill("\xa0").join("") +
          "lighthouse-web3 --chain fantom\n"
      );
      console.log(
        Array(5).fill("\xa0").join("") +
          "lighthouse-web3 --chain binance\n"
      );
      console.log("Create wallet and save it");
      console.log(
        Array(5).fill("\xa0").join("") +
          "lighthouse-web3 create-wallet --save\n"
      );
      console.log("Import wallet");
      console.log(
        Array(5).fill("\xa0").join("") +
          "lighthouse-web3 import-wallet --path wallet.json\n"
      );

      const response = await packageJson("lighthouse-web3");
      if (response) {
        console.log(chalk.yellow("Current Version: ") + version);
        console.log(chalk.yellow("Latest Version : ") + response.version);
        if (version !== response.version) {
          console.log(
            chalk.yellow("To update run  : ") +
              "npm i -g lighthouse-web3@latest"
          );
        }
      }
    }
  },
};
