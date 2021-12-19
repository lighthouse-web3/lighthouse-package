#!/usr/bin/env node

const yargs = require("yargs");

const Lighthouse = require("./Lighthouse");

yargs.version("1.1.0");
yargs.commandDir('Commands');
yargs.parserConfiguration({
  "parse-numbers": false,
});
yargs.alias("v", "version");
yargs.help(false);
yargs.parse();

yargs.argv;
module.exports = Lighthouse;
