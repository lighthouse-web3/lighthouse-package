const Conf = require("conf");
const chalk = require("chalk");
const packageJson = require("package-json");
const { version } = require("../package.json");

const config = new Conf();

module.exports = {
  command: "$0",
  builder: {
    network: {
      describe: "Network to use, delault: polygon mainnet",
      type: "String",
    },
  },
  handler: async function (argv) {
    if (argv.network) {
      if (
        argv.network.toString().toLowerCase() === "polygon" ||
        argv.network.toString().toLowerCase() === "matic"
      ) {
        config.set("Lighthouse_chain", "polygon");
        if (argv._[0] === "testnet") {
          config.set("Lighthouse_network", "testnet");
          console.log(chalk.green("Network set to polygon testnet"));
        } else {
          config.set("Lighthouse_network", "mainnet");
          console.log(chalk.green("Network set to polygon mainnet"));
        }
      } else if (
        argv.network.toString().toLowerCase() === "fantom" ||
        argv.network.toString().toLowerCase() === "ftm"
      ) {
        config.set("Lighthouse_chain", "fantom");
        if (argv._[0] === "testnet") {
          config.set("Lighthouse_network", "testnet");
          console.log(chalk.green("Network set to fantom testnet"));
        } else {
          config.set("Lighthouse_network", "mainnet");
          console.log(chalk.green("Network set to fantom mainnet"));
        }
      } else if (
        argv.network.toString().toLowerCase() === "binance" ||
        argv.network.toString().toLowerCase() === "bnb"
      ) {
        config.set("Lighthouse_chain", "binance");
        if (argv._[0] === "testnet") {
          config.set("Lighthouse_network", "testnet");
          console.log(chalk.green("Network set to binance testnet"));
        } else {
          config.set("Lighthouse_network", "mainnet");
          console.log(chalk.green("Network set to binance mainnet"));
        }
      } else {
        config.set("Lighthouse_chain", "polygon");
        if (argv._[0] === "testnet") {
          config.set("Lighthouse_network", "testnet");
          console.log(chalk.green("Network set to polygon testnet"));
        } else {
          config.set("Lighthouse_network", "mainnet");
          console.log(chalk.green("Network set to polygon mainnet"));
        }
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
        "--network" + Array(28).fill("\xa0").join("") + "Set network\n"
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
        Array(5).fill("\xa0").join("") + "lighthouse-web3 --network polygon\n"
      );
      console.log(
        Array(5).fill("\xa0").join("") +
          "lighthouse-web3 --network fantom testnet\n"
      );
      console.log(
        Array(5).fill("\xa0").join("") +
          "lighthouse-web3 --network binance mainnet\n"
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
