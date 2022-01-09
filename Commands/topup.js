const chalk = require("chalk");
// const Conf = require("conf");
// const config = new Conf();
// const read = require("read");
// const ethers = require("ethers");
// const package_config = require("../config.json");
// const Spinner = require("cli-spinner").Spinner;
// const { get_key } = require("../Lighthouse/get_key");
// const { topup } = require("../Lighthouse/topup");

module.exports = {
  command: "topup",
  desc: "send tokens to lighthouse endownment pool",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 topup <amount>");
      console.log();
      console.log(
        chalk.green("Description: ") +
          "send tokens to lighthouse endownment pool"
      );
    } else {
      console.log(chalk.yellow("Will be active soon!!!"));
      // const options = {
      //   prompt: "Enter your password: ",
      //   silent: true,
      //   default: "",
      // };

      // read(options, async (err, password) => {
      //   const key = await get_key(
      //     config.get("Lighthouse_privateKeyEncrypted"),
      //     password.trim()
      //   );

      //   if (key) {
      //     let spinner = new Spinner();
      //     spinner.start();
      //     const chain = config.get("Lighthouse_chain")?config.get("Lighthouse_chain"): "polygon";
      //     const current_network = package_config.network;
      //     const provider = new ethers.providers.JsonRpcProvider(
      //       package_config[current_network][chain]["rpc"]
      //     );
      //     const signer = new ethers.Wallet(key.privateKey, provider);
      //     const txObj = await topup(signer, 0.01, chain, current_network);
      //     spinner.stop();
      //     process.stdout.clearLine();
      //     process.stdout.cursorTo(0);

      //     if (txObj) {
      //       if (chain === "binance") {
      //         console.log(
      //           "Transaction: " + "https://bscscan.com/tx/" + txObj.transactionHash
      //         );
      //       } else if (chain === "fantom") {
      //         console.log(
      //           "Transaction: " + "https://ftmscan.com/tx/" + txObj.transactionHash
      //         );
      //       } else {
      //         console.log(
      //           "Transaction: " + "https://polygonscan.com/tx/" + txObj.transactionHash
      //         );
      //       }
      //       console.log(chalk.green("Transaction Success!!!"));
      //     } else{
      //       console.log(chalk.red("Something Went Wrong!"));
      //       process.exit();
      //     }

      //   } else {
      //     console.log(chalk.red("Something Went Wrong!"));
      //     process.exit();
      //   }
      // });
    }
  },
};
