import browser from './browser'
import uploadFile from './node'

export default async (
  path: string | any,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  uploadProgressCallback = (data: any) => {}
) => {
  // Upload File to IPFS
  if (typeof process !== 'undefined' && process.release.name === 'node') {
    return await uploadFile(path, apiKey, publicKey, signedMessage)
  } else {
    return await browser(
      path,
      apiKey,
      publicKey,
      signedMessage,
      uploadProgressCallback
    )
  }
}
