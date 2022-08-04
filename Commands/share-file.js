const Conf = require("conf");
const chalk = require("chalk");

const ethers = require("ethers");

const config = new Conf();
const lighthouse = require("../Lighthouse");
const readInput = require("../Utils/readInput");

const sign_auth_message = async (publicKey, privateKey) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const messageRequested = await lighthouse.getAuthMessage(publicKey);
  const signedMessage = await signer.signMessage(messageRequested);
  return signedMessage;
};

module.exports = {
  command: "share-file <cid> <address>",
  desc: "Share access to other user",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "\r\nlighthouse-web3 share-file <cid> <address>\r\n" +
          chalk.green("Description: ") +
          "Share access to other user\r\n"
      );
    } else {
      try {
        if (!config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
          throw new Error("Please import wallet first!");
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

        const signedMessage1 = await sign_auth_message(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          decryptedWallet.privateKey
        );

        const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
          argv.cid,
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          signedMessage1
        );
        if(!fileEncryptionKey) {
          throw new Error("Wallet address is not owner of file!!!")
        }

        const signedMessage2 = await sign_auth_message(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          decryptedWallet.privateKey
        );

        const shareResponse = await lighthouse.shareFile(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY"),
          argv.address,
          argv.cid,
          fileEncryptionKey,
          signedMessage2
        );

        console.log(chalk.white(shareResponse));
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
};
