import getQuote from './getQuote'
import getApiKey from './getApiKey'
import getBalance from './getBalance'
import dealStatus from './dealStatus'
import getUploads from './getUploads'
import getFileInfo from './getFileInfo'
import createWallet from './createWallet'

// Encryption
import shareFile from './encryption/shareFile'
import getAuthMessage from './encryption/getAuthMessage'
import revokeFileAccess from './encryption/revokeFileAccess'
import fetchEncryptionKey from './encryption/fetchEncryptionKey'
import applyAccessCondition from './encryption/applyAccessCondition'
import getAccessConditions from './encryption/getAccessConditions'

// Upload
import upload from './upload/files'
import uploadText from './upload/text'
import uploadBuffer from './upload/buffer'
import decryptFile from './uploadEncrypted/decrypt'
import uploadEncrypted from './uploadEncrypted/encrypt/file'
import textUploadEncrypted from './uploadEncrypted/encrypt/text'

// Data Depot
import createCar from './createCAR/createCar'
import viewCarFiles from './createCAR/viewCarFiles'
import dataDepotAuth from './createCAR/dataDepotAuth'

// IPNS
import generateKey from './ipns/generateKey'
import publishRecord from './ipns/publishRecord'
import getAllKeys from './ipns/getAllKeys'
import removeKey from './ipns/removeKey'

//PODSI
import posdi from './podsi'

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
  uploadEncrypted,
  textUploadEncrypted,
  decryptFile,
  createCar,
  dataDepotAuth,
  viewCarFiles,
  generateKey,
  publishRecord,
  getAllKeys,
  removeKey,
  posdi,
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
  uploadEncrypted,
  textUploadEncrypted,
  decryptFile,
  createCar,
  dataDepotAuth,
  viewCarFiles,
  generateKey,
  publishRecord,
  getAllKeys,
  removeKey,
  posdi,
}
