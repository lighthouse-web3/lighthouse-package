const axios = require("axios");
const Conf = require("conf");
const chalk = require("chalk");

const ethers = require("ethers");

const { bytesToSize } = require("./byteToSize");
const lighthouse_config = require("../lighthouse.config");
const lighthouse = require("../Lighthouse");

const config = new Conf();

const get_quote = async (path, publicKey, current_network, Spinner) => {
  const spinner = new Spinner("Getting Quote...");
  spinner.start();

  const response = await lighthouse.get_quote(path, publicKey, current_network);

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

    for (let i = 0; i < response.meta_data.length; i++) {
      console.log(
        response.meta_data[i].cid +
          Array(63 - response.meta_data[i].cid.length)
            .fill("\xa0")
            .join("") +
          bytesToSize(response.meta_data[i].file_size) +
          Array(
            12 - bytesToSize(response.meta_data[i].file_size).toString().length
          )
            .fill("\xa0")
            .join("") +
          response.meta_data[i].cost +
          Array(24 - response.meta_data[i].cost.toString().length)
            .fill("\xa0")
            .join("") +
          response.meta_data[i].mime_type +
          Array(24 - response.meta_data[i].mime_type.toString().length)
            .fill("\xa0")
            .join("") +
          response.meta_data[i].file_name
      );
    }

    console.log("\n" + chalk.cyan("Summary"));
    console.log("Total Size: " + bytesToSize(response.total_size));

    console.log(
      "Fees: " +
        response.total_cost.toFixed(18) +
        " " +
        lighthouse_config[current_network]["symbol"]
    );
    console.log(
      "Gas Fees: " +
        ethers.utils.parseUnits(
          ethers.utils.formatEther(response.gasFee),
          "ether"
        ) +
        " wei"
    );

    console.log(
      "Total Fee: " +
        Number(
          Number(response.total_cost.toFixed(18)) +
            Number(ethers.utils.formatEther(response.gasFee))
        ) +
        " " +
        lighthouse_config[current_network]["symbol"] +
        "\n"
    );

    console.log(chalk.cyan("Wallet"));
    console.log("Address: " + config.get("Lighthouse_publicKey"));
    console.log(
      "Current balance: " +
        response.current_balance * 10 ** -18 +
        " " +
        lighthouse_config[current_network]["symbol"]
    );

    const balance_after_deploy = Number(
      Number(response.current_balance * 10 ** -18) -
        Number(
          Number(response.total_cost.toFixed(18)) +
            Number(ethers.utils.formatEther(response.gasFee))
        )
    );
    console.log(
      "Balance after deploy: " +
        balance_after_deploy +
        " " +
        lighthouse_config[current_network]["symbol"] +
        "\n"
    );
    return {
      fileName: response.meta_data[0].file_name,
      cid: response.meta_data[0].cid,
      fileSize: response.meta_data[0].file_size,
      cost: response.total_cost,
      balance_after_deploy: balance_after_deploy,
      type: response.type,
    };
  } else {
    console.log(chalk.red("Error getting quote"));
    process.exit();
  }
};

const deploy = async (
  path,
  signer,
  signed_message,
  publicKey,
  current_network
) => {
  const deploy_response = await lighthouse.deploy(
    path,
    signer,
    true,
    signed_message,
    publicKey,
    current_network
  );

  console.log(
    chalk.green("File Deployed, visit following url to view content!")
  );

  console.log(
    chalk.cyan(
      "Visit: " +
        "https://gateway.lighthouse.storage/ipfs/" +
        deploy_response.Hash
    )
  );
  console.log(
    chalk.cyan("       " + "https://ipfs.io/ipfs/" + deploy_response.Hash)
  );

  console.log("CID: " + deploy_response.Hash);
  process.exit();
};

module.exports = {
  command: "deploy <path>",
  desc: "Deploy a file",
  handler: async function (argv) {
    if (argv.help) {
      console.log("lighthouse-web3 deploy <path>\n");
      console.log(chalk.green("Description: ") + "Deploy a file\n");
      console.log(chalk.cyan("Options:"));
      console.log(
        Array(3).fill("\xa0").join("") + "--path: Required, path to file\n"
      );
      console.log(chalk.magenta("Example:"));
      console.log(
        Array(3).fill("\xa0").join("") +
          "lighthouse-web3 deploy /home/cosmos/Desktop/ILoveAnime.jpg\n"
      );
    } else {
      try {
        // Import nodejs specific library
        const read = require("read");
        const { resolve } = require("path");
        const Spinner = require("cli-spinner").Spinner;

        const path = resolve(process.cwd(), argv.path);

        const current_network = config.get("Lighthouse_network")
          ? config.get("Lighthouse_network")
          : "mainnet";

        // Display Quote
        const quote_response = await get_quote(
          path,
          config.get("Lighthouse_publicKey"),
          current_network,
          Spinner
        );

        // Deploy
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
            if (quote_response.balance_after_deploy < 0) {
              console.log(chalk.red("Insufficient balance!"));
              process.exit();
            } else {
              const options = {
                prompt: "Enter your password: ",
                silent: true,
                default: "",
              };

              read(options, async (err, password) => {
                const key = await lighthouse.get_key(
                  config.get("Lighthouse_privateKeyEncrypted"),
                  password.trim()
                );
                if (key) {
                  const provider = new ethers.providers.JsonRpcProvider(
                    lighthouse_config[current_network]["rpc"]
                  );
                  const signer = new ethers.Wallet(key.privateKey, provider);
                  const publicKey = await signer.getAddress();
                  const message_response = await axios.get(
                    `https://api.lighthouse.storage/api/lighthouse/get_message?publicKey=${publicKey}`
                  );
                  const message = message_response.data;
                  const signed_message = await signer.signMessage(message);

                  await deploy(
                    path,
                    signer,
                    signed_message,
                    publicKey,
                    current_network
                  );
                } else {
                  console.log(chalk.red("Something Went Wrong!"));
                  process.exit();
                }
              });
            }
          } else {
            console.log(chalk.red("Aborted!"));
            process.exit();
          }
        });
      } catch (e) {
        console.log(chalk.red("Something Went Wrong!"));
        process.exit();
      }
    }
  },
};
