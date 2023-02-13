import { Command } from 'commander';
import Commands from './Commands';

const program = new Command();

program
  .version('0.2.0')
  .description('An example CLI for managing a directory')
  .option('-W, --wallet', 'Returns wallet public address')
  .option('-WF, --wallet-forget', 'Remove previously saved wallet')
  .option('-tc, --testChalk', 'test Chalk')
  .parse(process.argv);

const options = program.opts();

if (options.testChalk) {
  Commands.testChalk();
}

if (options.wallet) {
  Commands.wallet();
}
