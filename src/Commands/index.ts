import { Command } from 'commander';
import createWallet from './create-wallet';
import apiKey from './api-key';
import balance from './balance';
import wallet from './wallet';
import walletForget from './wallet-forget';
import upload from './upload';
import topUp from './top-up';
import uploadEncrypted from './upload-encrypted';
import shareFile from './share-file';
import importWallet from './import-wallet';
import revokeAccess from './revoke-access';
import resetPassword from './reset-password';
import getUploads from './get-uploads';
import decryptFile from './decrypt-file';

const widgets = new Command('lighthouse');

widgets.description('Our New CLI');
widgets.version('0.2.0');
widgets.option('-v, --verbose', 'verbose logging');

// TODO: add validation https://github.com/tj/commander.js/blob/master/examples/arguments-custom-processing.js?ref=morioh.com&utm_source=morioh.com

widgets.command('create-wallet').action(createWallet);
widgets
  .command('api-key')
  .description('Manage API key')
  .option('-n, --new', 'new API Key')
  .option('-i, --import <key>', 'To import existing api-key')
  .action(apiKey);

widgets
  .command('import-wallet')
  .description('Import an existing wallet')
  .option('--key , --privateKey <key>', 'Private key to wallet')
  .action(importWallet);

widgets.command('balance').description('Get your data usage').action(balance);
widgets
  .command('deal-status')
  .argument('<cid>', 'File Cid')
  .description('Get filecoin deal status of a CID')
  .action(balance);

widgets.command('wallet').description('Returns wallet public address and current network').action(wallet);
widgets.command('wallet-forget').description('Remove previously saved wallet').action(walletForget);
widgets.command('upload').description('Upload a file').argument('<path>', 'Path to file').action(upload);
widgets.command('top-up').description('Top up balance').argument('<amount>', 'Token amount').action(topUp);
widgets
  .command('upload-encrypted')
  .description('Upload a file encrypted')
  .argument('<path>', 'Path')
  .action(uploadEncrypted);

widgets
  .command('shared-file')
  .description('Share access to other user')
  .argument('<cid>', 'File Cid')
  .argument('<address>', "access reciever's address")
  .action(shareFile);

widgets
  .command('revoke-access')
  .description('Revoke Access on a file')
  .argument('<cid>', 'File Cid')
  .argument('<address>', "access reciever's address")
  .action(revokeAccess);

widgets.command('reset-password').description('Change password of your wallet').action(resetPassword);
widgets.command('get-uploads').description('Get details of file uploaded').action(getUploads);
widgets
  .command('decrypt-file')
  .argument('<cid>', 'File Cid')
  .description('Decrypt and download a file')
  .action(decryptFile);

export default widgets;
