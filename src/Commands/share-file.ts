import chalk from 'chalk';
import { addressValidator, isCID } from '../Utils/util';
import ethers from 'ethers';
import lighthouse from '../Lighthouse';
import Read from 'read';
import { config } from '../Utils/getNetwork';
import { sign_auth_message } from './utils/auth';


// module.exports = {
//   command: 'share-file [cid] [address]',
//   desc: 'Share access to other user',
//   handler:

export default async function (cid: string, address: string, _options: any) {
  if (!cid || !address) {
    console.log(
      '\r\nlighthouse-web3 share-file <cid> <address>\r\n' +
        chalk.green('Description: ') +
        'Share access to other user\r\n',
    );
  } else {
    try {
      if (!(config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY') as string)) {
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
        password?.trim(),
      );

      const signedMessage = await sign_auth_message(decryptedWallet.privateKey);

      const shareResponse = await lighthouse.shareFile(decryptedWallet.address, [address], cid, signedMessage);

      console.log(
        chalk.yellow('sharedTo: ') +
          chalk.white(shareResponse.data.shareTo) +
          '\r\n' +
          chalk.yellow('cid: ') +
          chalk.white(shareResponse.data.cid),
      );
    } catch (error: any) {
      console.log(chalk.red(error.message));
    }
  }
}
//   },
//   builder: function (yargs) {
//     yargs
//       .option('a', {
//         alias: 'address',
//         demandOption: true,
//         describe: "user's Address",
//         type: 'string',
//       })
//       .option('c', {
//         alias: 'cid',
//         demandOption: true,
//         describe: 'file CID',
//         type: 'string',
//       })
//       .help()
//       .check((argv, options) => {
//         // check if valid Address
//         if (!addressValidator(argv.address)) {
//           console.log(chalk.red('Invalid Address'));
//           throw new Error('Invalid Address');
//         }
//         if (!isCID(argv.cid)) {
//           console.log(chalk.red('Invalid CID'));
//           throw new Error('Invalid CID');
//         }
//         return true;
//       });
//   },
// };
