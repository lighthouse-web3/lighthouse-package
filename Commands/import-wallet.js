const fs = require("fs");
const Conf = require("conf");
const read = require("read");
const chalk = require("chalk");
const { resolve } = require("path");
const Lighthouse = require("../Lighthouse");

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
      console.log("lighthouse-web3 import-wallet");
      console.log();
      console.log(chalk.green("Description: ") + "Import an existing wallet");
      console.log();
      console.log(chalk.cyan("Options: "));
      console.log("   --key <privateKey>");
      console.log("   --path <path to wallet>");
      console.log();
      console.log(chalk.magenta("Example: "));
      console.log(
        "     lighthouse-web3 import-wallet --key 0xlkjhcf1721e6e1828a15c72c1d2aa80c633e45574cb60f5e821681999f3d1700"
      );
      console.log(
        "     lighthouse-web3 import-wallet --path /home/user/wallet.json"
      );
      console.log();
    } else {
      if (argv.key) {
        const privateKey = argv.key;
        const options = {
          prompt: "Set a password for your wallet:",
          silent: true,
          default: "",
        };

        read(options, async (err, result) => {
          const wallet = await Lighthouse.restore_keys(
            privateKey,
            result.trim()
          );
          if (wallet) {
            fs.writeFile(
              "wallet.json",
              JSON.stringify(wallet, null, 4),
              function (err) {
                if (err) {
                  console.log(chalk.red("Creating Wallet Failed!"));
                }

                config.set(
                  "Lighthouse_privateKeyEncrypted",
                  wallet["privateKeyEncrypted"]
                );
                config.set("Lighthouse_publicKey", wallet["publicKey"]);

                console.log(chalk.cyan("Public Key: " + wallet.publicKey));
                console.log(chalk.green("Wallet Created!"));
              }
            );
          } else {
            console.log(chalk.red("Creating Wallet Failed!"));
          }
        });
      } else if (argv.path) {
        try {
          const path = resolve(process.cwd(), argv.path);
          const wallet = JSON.parse(fs.readFileSync(path));
          if (wallet) {
            config.set(
              "Lighthouse_privateKeyEncrypted",
              wallet["privateKeyEncrypted"]
            );
            config.set("Lighthouse_publicKey", wallet["publicKey"]);
            console.log(chalk.green("Wallet Imported!"));
          } else {
            console.log(chalk.red("Importing Wallet Failed!"));
          }
        } catch (err) {
          console.log(chalk.red("Importing Wallet Failed!"));
        }
      } else {
        console.log(chalk.red("Invalid arguments!"));
        console.log("Usage: lighthouse-web3 import-wallet --key <private key>");
        console.log(
          "     : lighthouse-web3 import-wallet --path <path to wallet file>"
        );
      }
    }
  },
};
