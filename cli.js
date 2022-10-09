#!/usr/bin/env node

const yargs = require("yargs");

yargs.version("0.1.8");
yargs.commandDir("Commands");
yargs.parserConfiguration({
  "parse-numbers": false,
});
yargs.alias("v", "version");
yargs.help(false);
yargs.parse().argv;
