const fs = require("fs");
const Conf = require("conf");
const chalk = require("chalk");
const { resolve } = require("path");

const lighthouse = require("../Lighthouse");
const readInput = require("./Utils/readInput");

const config = new Conf();

module.exports = {
  command: "import-wallet",
  desc: "Import an existing wallet",
  builder: {
    key: {
      describe: "To import wallet using private key",
      type: "String",
    },
    path: {
      describe: "To import wallet using path to wallet file",
    },
  },
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\nlighthouse-web3 import-wallet\n" +
          chalk.green("Description: ") +
          "Import an existing wallet\n" +
          chalk.green("Options: \n") +
          Array(3).fill("\xa0").join("") +
          "- key: To import wallet using private key\n" +
          Array(3).fill("\xa0").join("") +
          "- path: To import wallet using path to wallet file\n" +
          chalk.magenta("Example: \n") +
          Array(5).fill("\xa0").join("") +
          "lighthouse-web3 import-wallet --key 0xlkjhcf1721e6e1828a15c72c1d2aa80c633e45574cb60f5e821681999f3d1700\n" +
          Array(5).fill("\xa0").join("") +
          "lighthouse-web3 import-wallet --path /home/user/wallet.json\n"
      );
    } else {
      if (argv.key) {
        const privateKey = argv.key;
        const options = {
          prompt: "Set a password for your wallet:",
          silent: true,
          default: "",
        };

        const password = await readInput(options);
        const wallet = await lighthouse.restoreKeys(privateKey, password);

        if (wallet) {
          fs.writeFile(
            "wallet.json",
            JSON.stringify(wallet, null, 4),
            (err) => {
              if (err) {
                console.log(chalk.red("Creating Wallet Failed!"));
              } else {
                config.set(
                  "LIGHTHOUSE_GLOBAL_PRIVATEKEYENCRYPTED",
                  wallet["privateKeyEncrypted"]
                );
                config.set("LIGHTHOUSE_GLOBAL_PUBLICKEY", wallet["publicKey"]);

                console.log(
                  chalk.cyan("Public Key: " + wallet.publicKey) +
                    chalk.green("\nWallet Created!")
                );
              }
            }
          );
        } else {
          console.log(chalk.red("Creating Wallet Failed!"));
        }
      } else if (argv.path) {
        try {
          const path = resolve(process.cwd(), argv.path);
          const wallet = JSON.parse(fs.readFileSync(path));
          if (wallet) {
            config.set(
              "LIGHTHOUSE_GLOBAL_PRIVATEKEYENCRYPTED",
              wallet["privateKeyEncrypted"]
            );
            config.set("LIGHTHOUSE_GLOBAL_PUBLICKEY", wallet["publicKey"]);
            console.log(
              chalk.cyan("Public Key: " + wallet.publicKey) +
                chalk.green("\nWallet Imported!")
            );
          } else {
            console.log(chalk.red("Importing Wallet Failed!"));
          }
        } catch (err) {
          console.log(chalk.red("Importing Wallet Failed!"));
        }
      } else {
        console.log(
          chalk.red("Invalid arguments!\n") +
            "Usage: lighthouse-web3 import-wallet --key <private key>" +
            Array(5).fill("\xa0").join("") +
            ": lighthouse-web3 import-wallet --path <path to wallet file>"
        );
      }
    }
  },
};
