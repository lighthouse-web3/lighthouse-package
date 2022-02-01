const chalk = require("chalk");
const Conf = require("conf");
// const read = require("read");
// const fs = require("fs");

const lighthouse = require("../Lighthouse");
const config = new Conf();

module.exports = {
  command: "reset-password <privateKey>",
  desc: "Change password of your wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 reset-password <privateKey>");
      console.log();
      console.log(
        chalk.green("Description: ") + "Change password of your wallet"
      );
    } else {
      const read = eval("require")("read");
      const fs = eval("require")("fs");

      const privateKey = argv.privateKey;
      const options = {
        prompt: "Set new password for your wallet:",
        silent: true,
        default: "",
      };

      read(options, async (err, result) => {
        const wallet = await lighthouse.restore_keys(privateKey, result.trim());
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

              console.log(chalk.green("Password Changed!"));
            }
          );
        } else {
          console.log(chalk.red("Creating Wallet Failed!"));
        }
      });
    }
  },
};
