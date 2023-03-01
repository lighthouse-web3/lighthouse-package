import { Command } from 'commander';
import { widgets } from './Commands';

const program = new Command();

program.description('Our New CLI');
program.version('0.0.1');
program.option('-v, --verbose', 'verbose logging');
program.addCommand(widgets);
program
  .description('An example CLI for managing a directory')
  .option('-W, --wallet', 'Returns wallet public address')
  .option('-WF, --wallet-forget', 'Remove previously saved wallet')
  .option('-tc, --testChalk', 'test Chalk')
  .option('-c, --create-wallet', 'create wallet')
  .parse(process.argv);

const options = program.opts();

if (options.testChalk) {
  console.log('Commands.testChalk();');
}

if (options.wallet) {
  console.log('Commands.wallet()');
}

program.addCommand(widgets);
