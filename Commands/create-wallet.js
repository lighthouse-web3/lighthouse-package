const chalk = require("chalk");
const Conf = require("conf");
const fs = require("fs");

const lighthouse = require("../Lighthouse");
const readInput = require("./Utils/readInput");

const config = new Conf();

module.exports = {
  command: "create-wallet",
  desc: "Creates a new wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\nlighthouse-web3 create-wallet\n" +
          chalk.green("Description: ") +
          "Creates a new wallet\n" +
          chalk.magenta("Example:") +
          Array(5).fill("\xa0").join("") +
          "lighthouse-web3 create-wallet\n"
      );
    } else {
      const options = {
        prompt: "Set a password for your wallet:",
        silent: true,
      };

      const password = await readInput(options);
      const wallet = await lighthouse.create_wallet(password.trim());

      wallet
        ? fs.writeFile(
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
          )
        : console.log(chalk.red("Creating Wallet Failed!"));
    }
  },
};
