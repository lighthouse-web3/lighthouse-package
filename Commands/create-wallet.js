const chalk = require("chalk");
const Conf = require("conf");
const read = require("read");
const fs = require("fs");

const lighthouse = require("../Lighthouse");
const config = new Conf();

module.exports = {
  command: "create-wallet",
  desc: "Creates a new wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 create-wallet");
      console.log();
      console.log(chalk.green("Description: ") + "Creates a new wallet");
      console.log();
      console.log(chalk.magenta("Example:"));
      console.log("   lighthouse-web3 create-wallet");
      console.log();
    } else {
      const options = {
        prompt: "Set a password for your wallet:",
        silent: true,
        default: "",
      };

      read(options, async (err, result) => {
        const wallet = await lighthouse.create_wallet(result.trim());
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
    }
  },
};
