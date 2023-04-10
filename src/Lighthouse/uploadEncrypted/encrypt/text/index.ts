import browserSide from './browser'
import serverSide from './node'

export default async (
  text: string,
  apiKey: string,
  publicKey: string,
  signedMessage: string
) => {
  // Upload File to IPFS
  if (typeof process !== 'undefined' && process.release.name === 'node') {
    return await serverSide(text, apiKey, publicKey, signedMessage)
  } else {
    return await browserSide(text, apiKey, publicKey, signedMessage)
  }
}
