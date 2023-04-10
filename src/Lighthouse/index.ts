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
import accessConditionFile from './encryption/accessConditionFile'
import getAccessConditions from './encryption/getAccessConditions'

// Upload
import upload from './upload/files'
import uploadText from './upload/text'
import decryptFile from './uploadEncrypted/decrypt'
import uploadBuffer from './upload/buffer/uploadBuffer'
import uploadEncrypted from './uploadEncrypted/encrypt/file'
import textUploadEncrypted from './uploadEncrypted/encrypt/text'

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
  accessConditionFile,
  getAccessConditions,
  upload,
  uploadText,
  uploadBuffer,
  uploadEncrypted,
  textUploadEncrypted,
  decryptFile,
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
  accessConditionFile,
  getAccessConditions,
  upload,
  uploadText,
  uploadBuffer,
  uploadEncrypted,
  textUploadEncrypted,
  decryptFile,
}
