const Conf = require("conf");
const chalk = require("chalk");

const fs = require("fs");
const ethers = require("ethers");
const { default: axios } = require("axios");

const config = new Conf();
const lighthouse = require("../Lighthouse");
const readInput = require("../Utils/readInput");
const lighthouseConfig = require("../lighthouse.config");

const sign_auth_message = async(publicKey, privateKey) =>{
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const messageRequested = await lighthouse.getAuthMessage(publicKey);
  const signedMessage = await signer.signMessage(messageRequested);
  return(signedMessage)
}

module.exports = {
  command: "decrypt-file <cid>",
  desc: "Decrypt and download a file",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\nlighthouse-web3 decrypt-file <cid>\n" +
          chalk.green("Description: ") +
          "Decrypt and download a file\n"
      );
    } else {
      try {
        if (!config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
          throw new Error("Please import wallet first!");
        }
        
        // get file details
        const fileDetails = (await axios.get(lighthouseConfig.lighthouseAPI + "/api/lighthouse/file_info?cid=" + argv.cid)).data;
        if(!fileDetails){
          throw new Error(
            "Unable to get CID details."
          );
        }

        // Get key
        options = {
          prompt: "Enter your password: ",
          silent: true,
          default: "",
        };
        const password = await readInput(options);
        const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
          config.get("LIGHTHOUSE_GLOBAL_WALLET"),
          password.trim()
        );

        if (!decryptedWallet) {
          throw new Error("Incorrect password!");
        }
        
        const signedMessage = await sign_auth_message(config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"), decryptedWallet.privateKey);
        const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
          argv.cid,
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          signedMessage
        );
        
        if(!fileEncryptionKey){
          throw new Error(
            "Failed to decrypt. Check if you have access to the file."
          );
        }

        // Decrypt
        const decryptedFile = await lighthouse.decryptFile(argv.cid, fileEncryptionKey)

        // save file
        fs.createWriteStream(fileDetails.fileName).write(Buffer.from(decryptedFile));
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
};
