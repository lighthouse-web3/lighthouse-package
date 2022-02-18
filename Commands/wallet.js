const Conf = require("conf");
const chalk = require("chalk");

const config = new Conf();

module.exports = {
  command: "wallet",
  desc: "Returns wallet public address",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 wallet\n");
      console.log(
        chalk.green("Description: ") + "Returns wallet public address"
      );
    } else {
      if (config.get("Lighthouse_publicKey")) {
        console.log(
          chalk.yellow("Public Key:") +
            Array(4).fill("\xa0").join("") +
            config.get("Lighthouse_publicKey")
        );

        const network = config.get("Lighthouse_network")
          ? config.get("Lighthouse_network")
          : "polygon";

        console.log(
          chalk.yellow("Network:") +
            Array(7).fill("\xa0").join("") +
            " " +
            network
        );
      } else {
        console.log(chalk.red("Please import wallet first!"));
      }
    }
  },
};
