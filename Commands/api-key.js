const axios = require("axios");
const Conf = require("conf");
const chalk = require("chalk");
const ethers = require("ethers");

const lighthouse = require("../Lighthouse");
const readInput = require("./Utils/readInput");
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
          "Get a new api key\n"
      );
    } else {
      const publicKey = config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY");
      const options = {
        prompt: "Enter your password: ",
        silent: true,
        default: "",
      };
      const password = await readInput(options);
      const key = await lighthouse.getKey(
        config.get("LIGHTHOUSE_GLOBAL_PRIVATEKEYENCRYPTED"),
        password.trim()
      );

      key
        ? (async () => {
            const verificationMessage = (
              await axios.get(
                lighthouseConfig.URL +
                  `/api/auth/get_message?publicKey=${publicKey}`
              )
            ).data;
            const provider = new ethers.getDefaultProvider();
            const signer = new ethers.Wallet(key.privateKey, provider);
            const signedMessage = await signer.signMessage(verificationMessage);

            const apiKey = await lighthouse.getApiKey(publicKey, signedMessage);

            config.set("LIGHTHOUSE_GLOBAL_API_KEY", apiKey);
            console.log(chalk.yellow("\nApi Key: ") + apiKey);
          })()
        : (() => {
            console.log(chalk.red("Incorrect password!"));
            process.exit();
          })();
    }
  },
};
