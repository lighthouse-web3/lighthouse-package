const Conf = require("conf");
const chalk = require("chalk");
const ethers = require("ethers");
const Spinner = require("cli-spinner").Spinner;

const lighthouse = require("../Lighthouse");
const byteToSize = require("../Utils/byteToSize");
const getNetwork = require("../Utils/getNetwork");

const lighthouseConfig = require("../lighthouse.config");
const config = new Conf();

module.exports = {
  command: "balance",
  desc: "Get your data usage",
  handler: async function (argv) {
    if (argv.help) {
      console.log(
        "lighthouse-web3 balance\n" +
          chalk.green("Description: ") +
          "Get data limit and usage of your account.\n"
      );
    } else {
      try {
        if (!config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")) {
          throw new Error("Wallet not created/imported");
        }
        const spinner = new Spinner("");
        spinner.start();

        const balance = await lighthouse.getBalance(
          config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
        );

        spinner.stop();
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        if (!balance) {
          throw new Error("Error fetching balance!");
        }

        console.log(
          chalk.yellow("\nData Limit: ") +
            Array(4).fill("\xa0").join("") +
            byteToSize(parseInt(balance.dataLimit)) +
            chalk.yellow("\nData Used: ") +
            Array(5).fill("\xa0").join("") +
            byteToSize(parseInt(balance.dataUsed)) +
            chalk.yellow("\nData Remaining: ") +
            byteToSize(parseInt(balance.dataLimit) - parseInt(balance.dataUsed))
        );

        const network = getNetwork();

        if (
          network === "polygon" ||
          network === "fantom" ||
          network === "binance" ||
          network === "optimism"
        ) {
          const provider = new ethers.providers.JsonRpcProvider(
            lighthouseConfig[network]["rpc"]
          );

          const contractABI = [
            {
              constant: true,
              inputs: [{ name: "account", type: "address" }],
              name: "balanceOf",
              outputs: [{ name: "", type: "uint256" }],
              payable: false,
              stateMutability: "view",
              type: "function",
            },
          ];

          const contractUSDT = new ethers.Contract(
            lighthouseConfig[network]["usdt_contract_address"],
            contractABI,
            provider
          );
          console.log(
            chalk.yellow("\nUSDT Balance: ") +
              Array(2).fill("\xa0").join("") +
              ethers.utils.formatUnits(
                await contractUSDT.balanceOf(
                  config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
                ),
                lighthouseConfig[network]["usd_contract_decimal"]
              )
          );

          const contractUSDC = new ethers.Contract(
            lighthouseConfig[network]["usdc_contract_address"],
            contractABI,
            provider
          );
          console.log(
            chalk.yellow("USDC Balance: ") +
              Array(2).fill("\xa0").join("") +
              ethers.utils.formatUnits(
                await contractUSDC.balanceOf(
                  config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
                ),
                lighthouseConfig[network]["usd_contract_decimal"]
              )
          );

          console.log(
            chalk.yellow(network) +
              ":" +
              Array(15 - network.length)
                .fill("\xa0")
                .join("") +
              ethers.utils.formatEther(
                await provider.getBalance(
                  config.get("LIGHTHOUSE_GLOBAL_PUBLICKEY")
                )
              )
          );
        }
      } catch (error) {
        console.log(chalk.red(error.message));
      }
    }
  },
};
