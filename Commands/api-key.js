const Conf = require("conf");
const chalk = require("chalk");

const lighthouse = require("../Lighthouse");
const readInput = require("./Utils/readInput");

const config = new Conf();

module.exports = {
  command: "api-key",
  desc: "Get new api key or show current key",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 api-key\n" +
          chalk.green("Description: ") +
          "Get new api key or show current key\n"
      );
    } else {
      if (argv.new || !config.get("LIGHTHOUSE_GLOBAL_API_KEY")){
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

        key? (async () => {
          const apiKey = await lighthouse.getApiKey(key.privateKey, true);
          config.set("LIGHTHOUSE_GLOBAL_API_KEY", apiKey);
          console.log(chalk.yellow("\nApi Key: ") + apiKey);
        })() : (()=>{
          console.log(chalk.red("Incorrect password!"));
          process.exit();
        })() 
      } else{
        console.log(chalk.yellow("\nApi Key ") + config.get("LIGHTHOUSE_GLOBAL_API_KEY"));
      }
    }
  },
};
