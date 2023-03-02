import chalk from 'chalk';
import { ethers } from 'ethers';
import { config } from '../Utils/getNetwork';
import Read = require('read');


export default async function () {
  try {
    let options = {
      prompt: 'Enter old password for your wallet:',
      silent: true,
      default: '',
    };
    const oldPassword: any = await Read(options, (err, res) => console.log(err, res));

    const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
      config.get('LIGHTHOUSE_GLOBAL_WALLET') as string,
      oldPassword.trim(),
    );
    if (!decryptedWallet) {
      throw new Error('Incorrect Password!');
    }

    options = {
      prompt: 'Set new password for your wallet:',
      silent: true,
      default: '',
    };

    const newPassword: any = await Read(options, (err, res) => console.log(err, res));
    const encryptedWallet = await decryptedWallet.encrypt(newPassword.trim());
    if (!encryptedWallet) {
      throw new Error('Password reset failed!');
    }

    config.set('LIGHTHOUSE_GLOBAL_WALLET', encryptedWallet);
    config.set('LIGHTHOUSE_GLOBAL_PUBLICKEY', decryptedWallet.address);

    console.log(chalk.cyan('Public Key: ' + decryptedWallet.address) + chalk.green('\r\nPassword reset successful'));
  } catch (error: any) {
    console.log(chalk.red(error.message));
  }
}
