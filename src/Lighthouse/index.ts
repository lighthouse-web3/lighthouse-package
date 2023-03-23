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
import { detect } from 'detect-browser';
import getEncryptionKeyPair from './encryption/getEncryptionKeyPair';
import getQuote from './getQuote';
import uploadBuffer from './upload/uploadBuffer';
import uploadText from './upload/uploadText';
import uploadEncrypted from './uploadEncrypted';
import decryptFile from './uploadEncrypted/decryptFile';
import textUploadEncrypted from './uploadEncrypted/textUploadEncrypted';
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
  uploadEncrypted,
  decryptFile,
  textUploadEncrypted,
  getAccessConditions,
  uploadText,
  getEncryptionKeyPair,
};

export default modules;
