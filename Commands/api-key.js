const axios = require("axios");
const Conf = require("conf");
const chalk = require("chalk");
const ethers = require("ethers");

const lighthouse = require("../Lighthouse");
const readInput = require("../Utils/readInput");
const lighthouseConfig = require("../lighthouse.config");

const config = new Conf();

module.exports = {
  command: "api-key",
  desc: "Get a new api key",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 api-key\n" +
          chalk.green("Description: ") +
          "Get a new api key\n" +
          chalk.green("Options: \n") +
          Array(3).fill("\xa0").join("") +
          "-- new: To create new api key\n" +
          Array(3).fill("\xa0").join("") +
          "- import: To import existing api-key\n" +
          chalk.magenta("Example: \n") +
          Array(5).fill("\xa0").join("") +
          "lighthouse-web3 api-key --import 937b68b8-3768-45d1-950b-30c3836785d1\n"
      );
    } else {
      if (argv.import) {
        config.set("LIGHTHOUSE_GLOBAL_API_KEY", argv.import);
        console.log(chalk.green("\nApi Key imported!!"));
      } else {
        try {
          if (config.get("LIGHTHOUSE_GLOBAL_API_KEY") && !argv.new) {
            console.log(
              chalk.yellow("\nApi Key: ") +
                config.get("LIGHTHOUSE_GLOBAL_API_KEY")
            );
          } else {
            if (!config.get("LIGHTHOUSE_GLOBAL_WALLET")) {
              throw new Error("Create/Import wallet first!!!");
            }

            const options = {
              prompt: "Enter your password: ",
              silent: true,
              default: "",
            };
            const password = await readInput(options);
            const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
              config.get("LIGHTHOUSE_GLOBAL_WALLET"),
              password.trim()
            );

            const verificationMessage = (
              await axios.get(
                lighthouseConfig.lighthouseAPI +
                  `/api/auth/get_message?publicKey=${decryptedWallet.address}`
              )
            ).data;
            const signedMessage = await decryptedWallet.signMessage(
              verificationMessage
            );

            const apiKey = await lighthouse.getApiKey(
              decryptedWallet.address,
              signedMessage
            );

            config.set("LIGHTHOUSE_GLOBAL_API_KEY", apiKey);
            console.log(chalk.yellow("\nApi Key: ") + apiKey);
          }
        } catch (error) {
          console.log(chalk.red(error.message));
        }
      }
    }
  },
};
