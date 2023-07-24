import browser from './browser'
import node from './node'

export default async (
  cid: string | any,
  fileEncryptionKey: string,
  mimeType = 'null'
) => {
  // Upload File to IPFS
  // @ts-expect-error
  if (typeof window === "undefined") {
    return await node(cid, fileEncryptionKey)
  } else {
    return await browser(cid, fileEncryptionKey, mimeType)
  }
}
