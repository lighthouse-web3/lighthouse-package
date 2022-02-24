const chalk = require("chalk");
const Conf = require("conf");
const fs = require("fs");

const readInput = require("./Utils/readInput");
const lighthouse = require("../Lighthouse");

const config = new Conf();

module.exports = {
  command: "reset-password <privateKey>",
  desc: "Change password of your wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 reset-password <privateKey>\n" +
          chalk.green("Description: ") +
          "Change password of your wallet"
      );
    } else {
      const privateKey = argv.privateKey;
      const options = {
        prompt: "Set new password for your wallet:",
        silent: true,
        default: "",
      };

      const password = await readInput(options);
      const wallet = await lighthouse.restore_keys(privateKey, password);
      if (wallet) {
        fs.writeFile("wallet.json", JSON.stringify(wallet, null, 4), (err) => {
          if (err) {
            console.log(chalk.red("Creating Wallet Failed!"));
          }

          config.set(
            "LIGHTHOUSE_GLOBAL_PRIVATEKEYENCRYPTED",
            wallet["privateKeyEncrypted"]
          );
          config.set("LIGHTHOUSE_GLOBAL_PUBLICKEY", wallet["publicKey"]);

          console.log(chalk.green("Password Changed!"));
        });
      } else {
        console.log(chalk.red("Creating Wallet Failed!"));
      }
    }
  },
};
