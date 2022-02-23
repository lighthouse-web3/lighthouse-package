const Conf = require("conf");
const chalk = require("chalk");
const packageJson = require("package-json");
const { version } = require("../package.json");

const config = new Conf();

const showHelp = () => {
  return(
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
    
    "\nbalance" +
    Array(30).fill("\xa0").join("") +
    "Get current balance of your wallet" +
    
    "\ndeploy" +
    Array(31).fill("\xa0").join("") +
    "Deploy a file" +
    
    "\nstatus" +
    Array(31).fill("\xa0").join("") +
    "Get metadata around the storage per CID" +
    
    "\nget-uploads" +
    Array(26).fill("\xa0").join("") +
    "Get details of file uploaded\n" +
    
    chalk.cyan("\nOptions") +
    "\n--network" +
    Array(28).fill("\xa0").join("") +
    "Set network\n" +
    
    "--help" +
    Array(31).fill("\xa0").join("") +
    "Help for a specific command command\n" +
    
    chalk.magenta("\nExample") +
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
          break;
        case "fantom":
        case "fantom-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "fantom");
          break;
        case "binance":
        case "binance-mainnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "binance");
          break;
        case "polygon-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "polygon-testnet");
          break;
        case "fantom-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "fantom-testnet");
          break;
        case "binance-testnet":
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "binance-testnet");
          break;
        default:
          config.set("LIGHTHOUSE_GLOBAL_NETWORK", "polygon");
      }
    } else {
      console.log(showHelp());

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
