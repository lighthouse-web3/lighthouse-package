const chalk = require("chalk");
const Conf = require("conf");

const config = new Conf();

module.exports = {
  command: "wallet-forget",
  desc: "Remove previously saved wallet",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\nlighthouse-web3 wallet-forget\n" +
          chalk.green("Description: ") +
          "Removes previously saved wallet\n"
      );
    } else {
      config.delete("LIGHTHOUSE_GLOBAL_WALLET");
      config.delete("LIGHTHOUSE_GLOBAL_PUBLICKEY");
      console.log(chalk.green("Wallet Removed!"));
    }
  },
};
