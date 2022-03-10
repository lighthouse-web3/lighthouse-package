const chalk = require("chalk");
const Conf = require("conf");

const bytesToSize = require("./Utils/byteToSize");
const getNetwork = require("./Utils/getNetwork");
const lighthouse = require("../Lighthouse");

const config = new Conf();

module.exports = {
  command: "get-uploads",
  desc: "Get details of file uploaded",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\nlighthouse-web3 get-uploads\n" +
          chalk.green("Description: ") +
          "Get details of file uploaded\n"
      );
    } else {
      const network = getNetwork();

      network && config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
        ? (async () => {
            try {
              const response = await lighthouse.getUploads(
                config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
                network
              );

              console.log(
                "\n" +
                  Array(4).fill("\xa0").join("") +
                  chalk.yellow("CID") +
                  Array(47).fill("\xa0").join("") +
                  chalk.yellow("File Name") +
                  Array(5).fill("\xa0").join("") +
                  chalk.yellow("File Size")
              );
              for (let i = 0; i < response.length; i++) {
                console.log(
                  Array(4).fill("\xa0").join("") +
                    response[i]["cid"] +
                    Array(4).fill("\xa0").join("") +
                    response[i]["fileName"].substring(0, 10) +
                    Array(4).fill("\xa0").join("") +
                    bytesToSize(Number(response[i]["fileSize"]["hex"])) +
                    "\n"
                );
              }
            } catch {
              console.log(chalk.red("Error fetching uploads!"));
            }
          })()
        : console.log(
            chalk.red("You have not imported wallet or selected the network!")
          );
    }
  },
};
