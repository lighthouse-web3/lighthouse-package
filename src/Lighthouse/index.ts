import getQuote from './getQuote'
import getApiKey from './getApiKey'
import getBalance from './getBalance'
import dealStatus from './dealStatus'
import getUploads from './getUploads'
import getFileInfo from './getFileInfo'
import createWallet from './createWallet'
import deleteFile from './deleteFile'

import shareFile from './encryption/shareFile'
import getAuthMessage from './encryption/getAuthMessage'
import revokeFileAccess from './encryption/revokeFileAccess'
import fetchEncryptionKey from './encryption/fetchEncryptionKey'
import applyAccessCondition from './encryption/applyAccessCondition'
import getAccessConditions from './encryption/getAccessConditions'

import upload from './upload/files'
import uploadText from './upload/text'
import uploadBuffer from './upload/buffer'
import uploadCAR from './upload/car'
import decryptFile from './uploadEncrypted/decrypt'
import uploadEncrypted from './uploadEncrypted/encrypt/file'
import textUploadEncrypted from './uploadEncrypted/encrypt/text'

import generateKey from './ipns/generateKey'
import publishRecord from './ipns/publishRecord'
import getAllKeys from './ipns/getAllKeys'
import removeKey from './ipns/removeKey'

export {
  getQuote,
  getApiKey,
  getBalance,
  dealStatus,
  getUploads,
  getFileInfo,
  createWallet,
  shareFile,
  getAuthMessage,
  revokeFileAccess,
  fetchEncryptionKey,
  applyAccessCondition,
  getAccessConditions,
  upload,
  uploadText,
  uploadBuffer,
  uploadCAR,
  uploadEncrypted,
  textUploadEncrypted,
  decryptFile,
  generateKey,
  publishRecord,
  getAllKeys,
  removeKey,
  deleteFile,
}

export default {
  getQuote,
  getApiKey,
  getBalance,
  dealStatus,
  getUploads,
  getFileInfo,
  createWallet,
  shareFile,
  getAuthMessage,
  revokeFileAccess,
  fetchEncryptionKey,
  applyAccessCondition,
  getAccessConditions,
  upload,
  uploadText,
  uploadBuffer,
  uploadCAR,
  uploadEncrypted,
  textUploadEncrypted,
  decryptFile,
  generateKey,
  publishRecord,
  getAllKeys,
  removeKey,
  deleteFile,
}
