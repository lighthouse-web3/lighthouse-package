const chalk = require("chalk");
const Conf = require("conf");

const lighthouse = require("../Lighthouse");
const config = new Conf();

module.exports = {
  command: "get-uploads",
  desc: "Get details of file uploaded",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 get-uploads");
      console.log();
      console.log(
        chalk.green("Description: ") + "Get details of file uploaded"
      );
    } else {
      if (config.get("Lighthouse_publicKey")) {
        const chain = config.get("Lighthouse_chain")
          ? config.get("Lighthouse_chain")
          : "polygon";
        const current_network = config.get("Lighthouse_network")
          ? config.get("Lighthouse_network")
          : "mainnet";

        const response = await lighthouse.get_uploads(
          config.get("Lighthouse_publicKey"),
          chain,
          current_network
        );
        console.log(chalk.yellow("CID: "));
        for (let i = 0; i < response.length; i++) {
          console.log(Array(5).fill("\xa0").join("") + response[i]["cid"]);
        }
      } else {
        console.log(chalk.red("Please import wallet first!"));
      }
    }
  },
};
