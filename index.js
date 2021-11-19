const yargs = require('yargs');
const chalk = require('chalk');
const axios = require('axios');
const util = require('util');
const fs = require("fs");
const FormData = require("form-data");

yargs.version('1.1.0');

const URL = 'http://localhost:8000'

yargs.command({
    command: 'user_token',
    describe: 'get temporary key for uploading data',
    handler: async function () {
        const response = await axios.get(URL+'/api/estuary/user_token');
        console.log(util.inspect(response.data, false, null, true));
    }
})

yargs.command({
    command: 'upload',
    describe: 'upload data to estuary',
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
        var formData = new FormData();
        const path = argv.path;
        formData.append("data", fs.createReadStream(path));

        const headers = formData.getHeaders();
        const response = await axios.post('https://shuttle-1.estuary.tech/content/add', formData, { 
            headers: {
                Authorization: `Bearer ${argv.token}`,
                ...headers,
            }}
        );
        console.log(util.inspect(response.data, false, null, true));
    }
})

yargs.command({
    command: 'metadata_by_cid',
    describe: 'get metadata around the storage per CID',
    builder: {
        cid: {
            describe: 'CID of the storage',
            demandOption: true,
            type: 'string'
        }
    },
    handler: async function (argv) {
        const response = await axios.get(URL+`/api/estuary/metadata_by_cid/${argv.cid}`);
        console.log(util.inspect(response.data, false, null, true));
    }
})

yargs.command({
    command: 'list_data',
    describe: 'list all of the data you have pinned to Estuary',
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
        if(argv.offset!==undefined && argv.limit!==undefined) {
            const response = await axios.get(URL+`/api/estuary/list_data?offset=${argv.offset}&limit=${argv.limit}`);
            console.log(util.inspect(response.data, false, null, true));
        } else{
            const response = await axios.get(URL+'/api/estuary/list_data?offset=0&limit=2');
            console.log(util.inspect(response.data, false, null, true));
        }
    }
})

yargs.command({
    command: 'get_deals',
    describe: 'get all of the deals being made for a specific Content ID stored',
    builder: {
        content_id: {
            describe: 'specific content id',
            demandOption: true,
            type: 'string'
        }
    },
    handler: async function (argv) {
        const response = await axios.get(URL+`/api/estuary/get_deals?content_id=${argv.content_id}`);
        console.log(util.inspect(response.data, false, null, true));
    }
})

console.log(yargs.argv);