const chalk = require("chalk");
const Conf = require("conf");

const getNetwork = require("./Utils/getNetwork");
const lighthouse = require("../Lighthouse");

const config = new Conf();

module.exports = {
  command: "get-uploads",
  desc: "Get details of file uploaded",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 get-uploads\n" +
          chalk.green("Description: ") +
          "Get details of file uploaded"
      );
    } else {
      const network = getNetwork();

      network && config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")?
      (async () => {
        try{
          const response = await lighthouse.get_uploads(
            config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
            network
          );
  
          console.log(chalk.yellow("CID: "));
          for (let i = 0; i < response.length; i++) {
            console.log(Array(5).fill("\xa0").join("") + response[i]["cid"]);
          }
        } catch{
          console.log(chalk.red("Error fetching uploads!"));
        }
      })() : console.log(chalk.red("You have not imported wallet or selected the network!"));
    }
  }
};
