const chalk = require("chalk");
const Conf = require("conf");
const config = new Conf();

module.exports = {
  command: "wallet-forget",
  desc: "Remove previously saved wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 wallet-forget\n");
      console.log(
        chalk.green("Description: ") + "Removes previously saved wallet"
      );
    } else {
      config.delete("Lighthouse_privateKeyEncrypted");
      config.delete("Lighthouse_publicKey");
      console.log(chalk.green("Wallet Removed!"));
    }
  },
};
