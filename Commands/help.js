const Conf = require("conf");
const chalk = require("chalk");
const packageJson = require("package-json");
const { version } = require("../package.json");

const config = new Conf();

const showHelp = () => {
  return (
    chalk.yellow("Welcome to lighthouse-web3\n\n") +
    "Usage: lighthouse-web3" +
    chalk.cyan(" [command] ") +
    chalk.green("[options]\n\n") +
    chalk.green("Commands (alias)") +
    chalk.grey(Array(21).fill("\xa0").join("") + "Description") +
    "\nwallet" +
    Array(31).fill("\xa0").join("") +
    "Returns wallet public address" +
    "\ncreate-wallet" +
    Array(24).fill("\xa0").join("") +
    "Creates a new wallet" +
    "\nimport-wallet" +
    Array(24).fill("\xa0").join("") +
    "Import an existing wallet" +
    "\nwallet-forget" +
    Array(24).fill("\xa0").join("") +
    "Remove previously saved wallet" +
    "\nreset-password" +
    Array(23).fill("\xa0").join("") +
    "Change your password" +
    "\nbalance" +
    Array(30).fill("\xa0").join("") +
    "Get your data usage" +
    "\ndeploy" +
    Array(31).fill("\xa0").join("") +
    "Deploy a file" +
    "\nstatus" +
    Array(31).fill("\xa0").join("") +
    "Get metadata around the storage per CID" +
    "\nget-uploads" +
    Array(26).fill("\xa0").join("") +
    "Get details of file uploaded" +
    "\napi-key" +
    Array(30).fill("\xa0").join("") +
    "Get new api key\n" +
    chalk.cyan("\nOptions") +
    "\n--network" +
    Array(28).fill("\xa0").join("") +
    "Set network\n" +
    "--help" +
    Array(31).fill("\xa0").join("") +
    "Help for a specific command command\n" +
    chalk.magenta("\nExample") +
    "\nNew api-key" +
    Array(7).fill("\xa0").join("") +
    "lighthouse-web3 api-key --new\n" +
    "\nChange Network" +
    Array(4).fill("\xa0").join("") +
    "lighthouse-web3 --network polygon\n" +
    Array(18).fill("\xa0").join("") +
    "lighthouse-web3 --network fantom-testnet\n" +
    Array(18).fill("\xa0").join("") +
    "lighthouse-web3 --network binance-mainnet\n" +
    "\nCreate wallet" +
    Array(5).fill("\xa0").join("") +
    "lighthouse-web3 create-wallet\n" +
    "\nImport wallet" +
    Array(5).fill("\xa0").join("") +
    "lighthouse-web3 import-wallet --path wallet.json\n"
  );
};

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
      switch (argv.network.toString().toLowerCase()) {
        case "polygon":
        case "polygon-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "polygon");
          console.log(chalk.green("Switched to polygon mainnet"));
          break;
        case "fantom":
        case "fantom-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "fantom");
          console.log(chalk.green("Switched to fantom mainnet"));
          break;
        case "binance":
        case "binance-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "binance");
          console.log(chalk.green("Switched to binance mainnet"));
          break;
        case "optimism":
        case "optimism-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "optimism");
          console.log(chalk.green("Switched to optimism mainnet"));
          break;
        case "polygon-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "polygon-testnet");
          console.log(chalk.green("Switched to polygon testnet"));
          break;
        case "fantom-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "fantom-testnet");
          console.log(chalk.green("Switched to fantom testnet"));
          break;
        case "binance-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "binance-testnet");
          console.log(chalk.green("Switched to binance testnet"));
          break;
        case "optimism-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "optimism-testnet");
          console.log(chalk.green("Switched to optimism testnet"));
          break;
        default:
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "polygon");
          console.log(chalk.green("Switched to polygon mainnet"));
      }
    } else {
      console.log(showHelp());

      const response = await packageJson("lighthouse-web3");
      if (response) {
        console.log(
          chalk.yellow("Current Version: ") +
            version +
            "\n" +
            chalk.yellow("Latest Version : ") +
            response.version
        );
        if (version !== response.version) {
          console.log(
            chalk.yellow("To update run  : ") +
              "npm i -g @lighthouse-web3/sdk"
          );
        }
      }
    }
  },
};
