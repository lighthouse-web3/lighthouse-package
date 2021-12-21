const chalk = require("chalk");
const read = require("read");
const Conf = require("conf");
const Spinner = require("cli-spinner").Spinner;
const Lighthouse = require("../Lighthouse");

const config = new Conf();

module.exports = {
  command: "deploy <path>",
  desc: "Deploy a directory or file",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 deploy <path>");
      console.log();
      console.log(chalk.green("Description: ") + "Deploy a directory or file");
      console.log();
      console.log(chalk.cyan("Options:"));
      console.log("   --path: Required, path to file");
      console.log();
      console.log(chalk.magenta("Example:"));
      console.log("   lighthouse-web3 deploy /home/cosmos/Desktop/ILoveAnime.jpg");
      console.log();
    } else{
      const path = argv.path;
      const spinner = new Spinner("Getting Quote...");
      spinner.start();
      const response = await Lighthouse.get_quote(
        argv.path,
        config.get("Lighthouse_publicKey")
      );
      spinner.stop();
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      if (response) {
        console.table(
          [
            {
              ID: response.ipfs_hash,
              Size: response.file_size,
              Fee: response.cost,
              Type: response.mime_type,
              Name: response.file_name,
            },
          ],
          ["ID", "Size", "Fee", "Type", "Name"]
        );

        console.log();

        console.log(chalk.cyan("Summary"));
        console.log("Total Size: " + response.file_size);
        console.log("Fees: " + response.cost);
        console.log("Gas Fees: " + response.gasFee * 10 ** -18);
        console.log(
          "Total Fee: " + (response.cost + response.gasFee * 10 ** -18)
        );

        console.log();

        console.log(chalk.cyan("Wallet"));
        console.log("Address: " + config.get("Lighthouse_publicKey"));
        console.log("Current balance: " + response.current_balance * 10 ** -18);
        const balance_after_deploy =
          (Number(response.current_balance) - (response.cost + response.gasFee)) *
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
                const key = await Lighthouse.get_key(
                  config.get("Lighthouse_privateKeyEncrypted"),
                  password.trim()
                );
                if (key) {
                  // Push CID to chain
                  console.log(chalk.green("Pushing CID to chain"));
                  let spinner = new Spinner("");
                  spinner.start();
                  const transaction = await Lighthouse.push_cid_tochain(
                    key.privateKey,
                    response.ipfs_hash,
                    response.cost.toFixed(4)
                  );
                  spinner.stop();
                  process.stdout.clearLine();
                  process.stdout.cursorTo(0);
                  console.log(
                    "Transaction: " +
                      "https://polygonscan.com/tx/" +
                      transaction.transactionHash
                  );
                  console.log(chalk.green("CID pushed to chain"));

                  console.log();

                  // Upload File
                  spinner = new Spinner("Uploading File");
                  spinner.start();
                  const upload_token = await Lighthouse.user_token("24h");
                  const deploy = await Lighthouse.deploy(
                    path,
                    upload_token.token
                  );
                  spinner.stop();
                  process.stdout.clearLine();
                  process.stdout.cursorTo(0);
                  console.log(
                    chalk.green(
                      "File Deployed, visit following url to view content!"
                    )
                  );
                  console.log(
                    chalk.cyan("Visit: " + "https://dweb.link/ipfs/" + deploy.cid)
                  );
                  console.log("CID: " + deploy.cid);

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
