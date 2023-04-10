import browser from './browser'
import node from './node'

export default async (
  cid: string | any,
  fileEncryptionKey: string,
  mimeType = 'null'
) => {
  // Upload File to IPFS
  if (typeof process !== 'undefined' && process.release.name === 'node') {
    return await node(cid, fileEncryptionKey)
  } else {
    return await browser(cid, fileEncryptionKey, mimeType)
  }
}
