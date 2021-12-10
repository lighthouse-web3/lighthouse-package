#!/usr/bin/env node

const yargs = require("yargs");
const chalk = require("chalk");
const util = require("util");
const read = require("read");
const fs = require("fs");
const Conf = require("conf");

const Lighthouse = require("./Lighthouse");

/*
colour scheme for cli
    heading - cyan
    info - green
    error - red
    warning - yellow
*/
const config = new Conf();
yargs.version("1.0.0");
yargs.usage(
  "Usage: lighthouse-web3" +
    chalk.cyan(" [command] ") +
    chalk.green("[options]")
);

yargs.alias("h", "help");
yargs.alias("v", "version");

yargs.command({
  command: ["$0", "help"],
  handler: async function (argv) {
    console.log(chalk.yellow("Welcome to lighthouse-web3"));
    console.log();
    console.log(
      "Usage: lighthouse-web3" +
        chalk.cyan(" [command] ") +
        chalk.green("[options]")
    );
    console.log();
    console.log(
      chalk.green("Commands (alias)") +
        chalk.grey("                     Description")
    );
    console.log(
      "create-wallet   " + "                     Creates a new wallet"
    );
    console.log(
      "import-wallet   " + "                     Import an existing wallet"
    );
    console.log(
      "wallet-forget   " + "                     Remove previously saved wallet"
    );
    console.log(
      "balance         " +
        "                     Get current balance of your wallet"
    );
    console.log(
      "deploy          " + "                     Deploy a directory or file"
    );
    console.log(
      "status          " +
        "                     Get metadata around the storage per CID"
    );
    console.log();
    console.log(chalk.cyan("Options"));
    console.log(
      "--save          " +
        "                     Saves the wallet after creation"
    );
  },
});

yargs.command({
  command: "create-wallet",
  describe: "Creates a new wallet",
  builder: {
    save: {
      describe: "Saves the wallet after creation",
    },
  },
  handler: async function (argv) {
    const options = {
      prompt: "Set a password for your wallet:",
      silent: true,
      default: "",
    };

    let save_wallet = false;
    if (argv.save) {
      save_wallet = true;
    }

    read(options, async (err, result) => {
      const wallet = await Lighthouse.create_wallet(result.trim());
      if (wallet) {
        fs.writeFile(
          "wallet.json",
          JSON.stringify(wallet, null, 4),
          function (err) {
            if (err) {
              console.log(chalk.red("Creating Wallet Failed!"));
            }

            if (save_wallet) {
              config.set(
                "Lighthouse_privateKeyEncrypted",
                wallet["privateKeyEncrypted"]
              );
              config.set("Lighthouse_publicKey", wallet["publicKey"]);
            }

            console.log(chalk.cyan("Public Key: " + wallet.publicKey));
            console.log(chalk.green("Wallet Created!"));
          }
        );
      } else {
        console.log(chalk.red("Creating Wallet Failed!"));
      }
    });
  },
});

yargs.command({
  command: "import-wallet",
  describe: "Import an existing wallet",
  builder: {
    path: {
      describe: "Path to wallet",
      demandOption: true,
      type: "string",
    },
  },
  handler: async function (argv) {
    const wallet = JSON.parse(fs.readFileSync(argv.path, "utf8"));
    config.set("Lighthouse_privateKeyEncrypted", wallet["privateKeyEncrypted"]);
    config.set("Lighthouse_publicKey", wallet["publicKey"]);
    console.log(chalk.green("Wallet Imported!"));
  },
});

yargs.command({
  command: "wallet-forget",
  describe: "Remove previously saved wallet",
  handler: async function (argv) {
    config.delete("Lighthouse_privateKeyEncrypted");
    config.delete("Lighthouse_publicKey");
    console.log(chalk.green("Wallet Removed!"));
  },
});

yargs.command({
  command: "balance",
  describe: "Get current balance of your wallet",
  handler: async function (argv) {
    const balance = await Lighthouse.get_balance(
      config.get("Lighthouse_publicKey")
    );
    if (balance) {
      console.log(chalk.green("balance " + balance.data * 10 ** -18));
    } else {
      console.log(chalk.red("Something Went Wrong!"));
    }
  },
});

yargs.command({
  command: "deploy",
  describe: "Deploy a directory or file",
  builder: {
    path: {
      describe: "Path of file to be uploaded",
      demandOption: true,
      type: "string",
    },
  },
  handler: async function (argv) {
    const path = argv.path;
    const response = await Lighthouse.get_quote(
      argv.path,
      config.get("Lighthouse_publicKey")
    );
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
        ) + "Y/n"
      );

      const options = {
        prompt: "",
        default: "n",
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
                const transaction = await Lighthouse.push_cid_tochain(
                  key.privateKey,
                  deploy.cid,
                  response.cost
                );
                console.log(
                  "Transaction: " +
                    "https://polygonscan.com/tx/" +
                    transaction.transactionHash
                );
                console.log(chalk.green("CID pushed to chain"));

                console.log();

                // Upload File
                const upload_token = await Lighthouse.user_token("24h");
                const deploy = await Lighthouse.deploy(
                  path,
                  upload_token.token
                );
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
  },
});

yargs.command({
  command: "status",
  describe: "Get metadata around the storage per CID",
  builder: {
    cid: {
      describe: "CID of the storage",
      demandOption: true,
      type: "string",
    },
  },
  handler: async function (argv) {
    const response = await Lighthouse.status(argv.cid);
    console.log(util.inspect(response, false, null, true));
  },
});

yargs.command({
  command: "list-data",
  describe: "List all of the data you have pinned to IPFS",
  builder: {
    offset: {
      describe: "starting of list",
      demandOption: false,
      type: "string",
    },
    limit: {
      describe: "number of items to return",
      demandOption: false,
      type: "string",
    },
  },
  handler: async function (argv) {
    const response = await Lighthouse.list_data(argv.offset, argv.limit);
    console.log(util.inspect(response, false, null, true));
  },
});

yargs.command({
  command: "get-deals",
  describe: "Get all of the deals being made for a specific Content ID stored",
  builder: {
    content_id: {
      describe: "specific content id",
      demandOption: true,
      type: "string",
    },
  },
  handler: async function (argv) {
    const response = await Lighthouse.get_deals(argv.content_id);
    console.log(util.inspect(response.data, false, null, true));
  },
});

yargs.argv;
module.exports = Lighthouse;
