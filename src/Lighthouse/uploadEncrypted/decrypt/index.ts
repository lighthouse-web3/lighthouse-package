import browser from './browser'
import node from './node'

export default async (
  cid: string | any,
  fileEncryptionKey: string,
  mimeType = 'null',
  gatewayUrl?: string
) => {
  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await node(cid, fileEncryptionKey, gatewayUrl)
  } else {
    return await browser(cid, fileEncryptionKey, mimeType, gatewayUrl)
  }
}
