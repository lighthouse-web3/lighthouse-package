const chalk = require("chalk");

const getNetwork = require("./Utils/getNetwork");
const lighthouse = require("../Lighthouse");

module.exports = {
  command: "get-uploads",
  desc: "Get details of file uploaded",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 get-uploads\n" + chalk.green("Description: ") + "Get details of file uploaded");
    } else {
      if(getNetwork() && config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")){
        const response = await lighthouse.get_uploads(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          network
        );

        console.log(chalk.yellow("CID: "));
        for (let i = 0; i < response.length; i++) {
          console.log(Array(5).fill("\xa0").join("") + response[i]["cid"]);
        }
      } else{
        console.log(chalk.red("You have not imported wallet or selected the network!"));
      }
    }
  },
};
