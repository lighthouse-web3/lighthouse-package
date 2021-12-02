const yargs = require('yargs');
const chalk = require('chalk');
const util = require('util');
const read = require("read");
const fs = require('fs');
const { exec } = require('child_process');

const Lighthouse = require('./Lighthouse');

/*
colour scheme for cli
    heading - blue
    info - green
    error - red
    warning - yellow
*/
yargs.version('1.1.0');

yargs.command({
    command: 'create_wallet',
    describe: 'Creates a new wallet',
    handler: async function (argv) {
        const options = {
            prompt: 'Set a password for your wallet ',
            silent: true,
            default: '',
        }
        
        read(options, async (err, result)=>{
            const wallet = await Lighthouse.create_wallet(result.trim());
            if(wallet){
                fs.writeFile('LighthouseWallet.json', JSON.stringify(wallet, null, 4), function(err) {
                    if(err) {
                        console.log(chalk.red('Issue with path'));
                    }
                    console.log(chalk.green('Wallet Created!'));
                });
            }else{
                console.log(chalk.red('Creating Wallet Failed!'));
            }
        })
    }
})

yargs.command({
    command: 'import_wallet',
    describe: 'Import an existing wallet',
    builder: {
        path: {
            describe: 'Path to wallet',
            demandOption: true,
            type: 'string'
        },
    },
    handler: async function (argv) {
        const wallet = JSON.parse(fs.readFileSync(argv.path, 'utf8'));
        // console.log(wallet['privateKeyEncrypted']);
        exec(`export Lighthouse_privateKeyEncrypted=${wallet['privateKeyEncrypted']}`);
        console.log(chalk.green('Wallet Imported!'));
    }
})

yargs.command({
    command: 'balance',
    describe: 'Get current balance of your wallet',
    handler: async function (argv) {
        const balance = await Lighthouse.get_balance(argv.publicKey);
        if(balance){
            console.log(chalk.green(balance));
        }else{
            console.log(chalk.red('Something Went Wrong!'));
        }
    }
})

// yargs.command({
//     command: 'user_token',
//     describe: 'Get temporary key for uploading data',
//     handler: async function () {
//         const response = await Lighthouse.user_token();
//         console.log(util.inspect(response, false, null, true));
//     }
// })

yargs.command({
    command: 'upload',
    describe: 'Upload a directory or file',
    builder: {
        path: {
            describe: 'Path of file to be uploaded',
            demandOption: true,
            type: 'string'
        },
        token: {
            describe: 'Token for uploading data, you can get it from user_token command',
            demandOption: true,
            type: 'string'
        }
    },
    handler: async function (argv) {
        const response = await Lighthouse.upload(argv.path, argv.token);
        console.log(util.inspect(response, false, null, true));
    }
})

yargs.command({
    command: 'metadata_by_cid',
    describe: 'Get metadata around the storage per CID',
    builder: {
        cid: {
            describe: 'CID of the storage',
            demandOption: true,
            type: 'string'
        }
    },
    handler: async function (argv) {
        const response = await Lighthouse.metadata_by_cid(argv.cid);
        console.log(util.inspect(response, false, null, true));
    }
})

yargs.command({
    command: 'list_data',
    describe: 'List all of the data you have pinned to IPFS',
    builder: {
        offset: {
            describe: 'starting of list',
            demandOption: false,
            type: 'string'
        },
        limit: {
            describe: 'number of items to return',
            demandOption: false,
            type: 'string'
        }
    },
    handler: async function (argv) {
        const response = await Lighthouse.list_data(argv.offset, argv.limit);
        console.log(util.inspect(response, false, null, true));
    }
})

yargs.command({
    command: 'get_deals',
    describe: 'Get all of the deals being made for a specific Content ID stored',
    builder: {
        content_id: {
            describe: 'specific content id',
            demandOption: true,
            type: 'string'
        }
    },
    handler: async function (argv) {
        const response = await Lighthouse.get_deals(argv.content_id);
        console.log(util.inspect(response.data, false, null, true));
    }
})

yargs.argv;
module.exports = Lighthouse;
