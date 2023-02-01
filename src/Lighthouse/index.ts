/* istanbul ignore file */
import addCid from './addCid';
import dealStatus from './dealStatus';
import getApiKey from './getApiKey';
import getBalance from './getBalance';
import getUploads from './getUploads';
import createWallet from './createWallet';
import getFileInfo from './getFileInfo';

// Get Contract Address
import getContractAddress from './getContractAddress';

// Encryption BLS
import shareFile from './encryption/shareFile';
import getAuthMessage from './encryption/getAuthMessage';
import revokeFileAccess from './encryption/revokeFileAccess';
import accessCondition from './encryption/accessConditionFile';
import fetchEncryptionKey from './encryption/fetchEncryptionKey';
import getAccessConditions from './encryption/getAccessConditions';
import upload from './upload';
import getQuote from './getQuote';
import { detect } from 'detect-browser';
import uploadBuffer from './upload/uploadBuffer';
import uploadText from './upload/uploadText';
// import uploadEncrypted from './uploadEncrypted/node';
// import decryptFile from './uploadEncrypted/node/decryptFile';
// import textUploadEncrypted from './uploadEncrypted/node/textUploadEncrypted';
// import uploadBrowser from './upload/browser';
// import decryptFileBrowser from './uploadEncrypted/browser/decryptFile';
// import uploadEncryptedBrower from './uploadEncrypted/browser/index.js';

const modules = {
  upload,
  addCid,
  getApiKey,
  uploadBuffer,
  createWallet,
  getQuote,
  getBalance,
  getUploads,
  dealStatus,
  getContractAddress,
  getFileInfo,
  fetchEncryptionKey,
  getAuthMessage,
  shareFile,
  accessCondition,
  revokeFileAccess,
  // uploadEncrypted,
  // decryptFile,
  // textUploadEncrypted,
  getAccessConditions,
  uploadText,
};

// if (typeof window === 'undefined') {
//   modules = {};
// } else {
//   import upload from './upload/browser';
//   import decryptFile from './uploadEncrypted/browser/decryptFile';
//   import uploadEncrypted from './uploadEncrypted/browser/index.js';

//   module.exports = {
//     upload,
//     addCid,
//     getApiKey,
//     getBalance,
//     getUploads,
//     dealStatus,
//     getContractAddress,
//     getFileInfo,
//     uploadEncrypted,
//     decryptFile,
//     fetchEncryptionKey,
//     getAuthMessage,
//     shareFile,
//     accessCondition,
//     revokeFileAccess,defaultdefault
//     getAccessConditions,
//   };
// }

export default modules;
