const axios = require("axios");
const Conf = require("conf");
const chalk = require("chalk");
const ethers = require("ethers");

const lighthouse = require("../Lighthouse");
const readInput = require("./Utils/readInput");
const lighthouseConfig = require("../lighthouse.config");
const {tetherAbi} = require("../Lighthouse/contractAbi/tetherAbi");

const config = new Conf();

module.exports = {
  command: "custom-gateway",
  desc: "Get IPFS gateway of your desired name",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 custom-gateway\n" +
          chalk.green("Description: ") +
          "Get IPFS gateway of your desired name\n"
      );
    } else {
      const publicKey = config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY");

      console.log(
        chalk.green(
          "Carefully check the above details are correct, then confirm to complete this upload"
        ) + " Y/n"
      );

      const options = {
        prompt: "",
      };

      const selected = await readInput(options);
      if (
        selected.trim() == "Y" ||
        selected.trim() == "y" ||
        selected.trim() == "yes"
      ) {
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

        const abi = (await axios.get(`https://api.bscscan.com/api?module=contract&action=getabi&address=0x55d398326f99059fF775485246999027B3197955&apikey=T6ZDHS7NIWDCN2RVG4MQVCK7SHQGXRP8ND`)).data;
        const send_abi = JSON.parse(abi.result);

        const provider = new ethers.providers.JsonRpcProvider(
          "https://bsc-dataseed.binance.org/"
        );
        const signer = new ethers.Wallet(key.privateKey, provider);
        const contract = new ethers.Contract("0x55d398326f99059fF775485246999027B3197955", send_abi, signer);

        const send_token_amount = "0.1";
        const numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18);
        const gasLimit = ethers.utils.hexlify(1000000);
    
        try{
          const txResponse = await contract.transfer("0xC88C729Ef2c18baf1074EA0Df537d61a54A8CE7b", numberOfTokens, {gasLimit: gasLimit});
          const txReceipt = await txResponse.wait();
          console.log(txReceipt);
        } catch (error){
          console.error(error.code)
        }

      } else{
        console.log(chalk.red("Cancelled"));
      }
    }
  },
};

