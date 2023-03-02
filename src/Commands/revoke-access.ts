import chalk from 'chalk';
import { addressValidator, isCID } from '../Utils/util';
import ethers from 'ethers';
import { config } from '../Utils/getNetwork';
import lighthouse from '../Lighthouse';
import { sign_auth_message } from './utils/auth';
import Read = require('read');

// module.exports = {
//   command: 'revoke-access [cid] [address]',
//   desc: 'Revoke Access on a file',
//   handler:

export default async function (cid: string, address: string) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')) {
      throw new Error('Please import wallet first!');
    }

    // Get key
    const options = {
      prompt: 'Enter your password: ',
      silent: true,
      default: '',
    };
    const password: any = await Read(options, (err, res) => console.log(err, res));
    const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
      config.get('LIGHTHOUSE_GLOBAL_WALLET') as string,
      password.trim(),
    );

    if (!decryptedWallet) {
      throw new Error('Incorrect password!');
    }

    const signedMessage = await sign_auth_message(decryptedWallet.privateKey);

    const revokeResponse = await lighthouse.revokeFileAccess(
      decryptedWallet.address,
      address,
      cid,
      signedMessage,
    );

    console.log(
      chalk.yellow('revokeTo: ') +
        chalk.white(revokeResponse.data.revokeTo) +
        '\r\n' +
        chalk.yellow('cid: ') +
        chalk.white(revokeResponse.data.cid),
    );
  } catch (error: any) {
    console.log(chalk.red(error.message));
  }
}
