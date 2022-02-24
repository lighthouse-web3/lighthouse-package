const Conf = require("conf");
const chalk = require("chalk");

const getNetwork = require("./Utils/getNetwork");

const config = new Conf();

module.exports = {
  command: "wallet",
  desc: "Returns wallet public address",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\nlighthouse-web3 wallet\n" +
          chalk.green("Description: ") +
          "Returns wallet public address and current network\n"
      );
    } else {
      if (config.get("Lighthouse_publicKey")) {
        console.log(
          chalk.yellow("Public Key:") +
            Array(4).fill("\xa0").join("") +
            config.get("Lighthouse_publicKey")
        );

        console.log(
          chalk.yellow("Network:") +
            Array(7).fill("\xa0").join("") +
            getNetwork()
        );
      } else {
        console.log(chalk.red("Please import wallet first!"));
      }
    }
  },
};
