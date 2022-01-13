const read = require("read");
const Conf = require("conf");
const chalk = require("chalk");
const { resolve } = require("path");
const Spinner = require("cli-spinner").Spinner;

const ethers = require("ethers");

const { bytesToSize } = require("./byteToSize");
const package_chain = require("../config.json");
const { deploy } = require("../Lighthouse/deploy");
const { get_key } = require("../Lighthouse/get_key");
const { get_quote } = require("../Lighthouse/get_quote");

const config = new Conf();

module.exports = {
  command: "deploy <path>",
  desc: "Deploy a file",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 deploy <path>");
      console.log();
      console.log(chalk.green("Description: ") + "Deploy a file");
      console.log();
      console.log(chalk.cyan("Options:"));
      console.log("   --path: Required, path to file");
      console.log();
      console.log(chalk.magenta("Example:"));
      console.log(
        "   lighthouse-web3 deploy /home/cosmos/Desktop/ILoveAnime.jpg"
      );
      console.log();
    } else {
      const path = resolve(process.cwd(), argv.path);
      const spinner = new Spinner("Getting Quote...");
      spinner.start();
      const response = await get_quote(
        path,
        config.get("Lighthouse_publicKey"),
        config.get("Lighthouse_chain")
          ? config.get("Lighthouse_chain")
          : "polygon",
        package_chain.network
      );
      spinner.stop();
      process.stdout.clearLine();
      process.stdout.cursorTo(0);

      if (response) {
        console.log(
          chalk.cyan("CID") +
            Array(60).fill("\xa0").join("") +
            chalk.cyan("Size") +
            Array(8).fill("\xa0").join("") +
            chalk.cyan("Fee") +
            Array(21).fill("\xa0").join("") +
            chalk.cyan("Type") +
            Array(20).fill("\xa0").join("") +
            chalk.cyan("Name")
        );

        console.log(
          response.ipfs_hash +
            Array(63 - response.ipfs_hash.length)
              .fill("\xa0")
              .join("") +
            bytesToSize(response.file_size) +
            Array(12 - bytesToSize(response.file_size).toString().length)
              .fill("\xa0")
              .join("") +
            response.cost +
            Array(24 - response.cost.toString().length)
              .fill("\xa0")
              .join("") +
            response.mime_type +
            Array(24 - response.mime_type.length)
              .fill("\xa0")
              .join("") +
            response.file_name
        );

        console.log();

        console.log(chalk.cyan("Summary"));
        console.log("Total Size: " + bytesToSize(response.file_size));
        console.log("Fees: " + response.cost);
        console.log(
          "Gas Fees: " +
            ethers.utils.parseUnits(
              ethers.utils.formatEther(response.gasFee),
              "ether"
            )
        );
        console.log(
          "Total Fee: " + (response.cost + response.gasFee * 10 ** -18)
        );

        console.log();

        console.log(chalk.cyan("Wallet"));
        console.log("Address: " + config.get("Lighthouse_publicKey"));
        console.log("Current balance: " + response.current_balance * 10 ** -18);
        const balance_after_deploy =
          (Number(response.current_balance) -
            (response.cost + response.gasFee)) *
          10 ** -18;
        console.log("Balance after deploy: " + balance_after_deploy);

        console.log();

        console.log(
          chalk.green(
            "Carefully check the above details are correct, then confirm to complete this upload"
          ) + " Y/n"
        );

        const options = {
          prompt: "",
        };

        read(options, async (err, result) => {
          if (
            result.trim() == "Y" ||
            result.trim() == "y" ||
            result.trim() == "yes"
          ) {
            if (balance_after_deploy < 0) {
              console.log(chalk.red("Insufficient balance!"));
              process.exit();
            } else {
              const options = {
                prompt: "Enter your password: ",
                silent: true,
                default: "",
              };

              read(options, async (err, password) => {
                const key = await get_key(
                  config.get("Lighthouse_privateKeyEncrypted"),
                  password.trim()
                );

                if (key) {
                  const chain = config.get("Lighthouse_chain")
                    ? config.get("Lighthouse_chain")
                    : "polygon";
                  const current_network = package_chain.network;
                  const provider = new ethers.providers.JsonRpcProvider(
                    package_chain[current_network][chain]["rpc"]
                  );
                  const signer = new ethers.Wallet(key.privateKey, provider);
                  const deploy_response = await deploy(
                    path,
                    signer,
                    response.ipfs_hash,
                    true,
                    chain,
                    current_network
                  );
                  console.log(
                    chalk.green(
                      "File Deployed, visit following url to view content!"
                    )
                  );
                  console.log(
                    chalk.cyan(
                      "Visit: " +
                        "https://dweb.link/ipfs/" +
                        deploy_response.cid
                    )
                  );
                  console.log(
                    chalk.cyan(
                      "     : " + "https://ipfs.io/ipfs/" + deploy_response.cid
                    )
                  );
                  console.log("CID: " + deploy_response.cid);
                  process.exit();
                } else {
                  console.log(chalk.red("Something Went Wrong!"));
                  process.exit();
                }
              });
            }
          } else {
            console.log(chalk.red("Upload Cancelled!"));
            process.exit();
          }
        });
      } else {
        console.log(chalk.red("Something Went Wrong!"));
        process.exit();
      }
    }
  },
};
