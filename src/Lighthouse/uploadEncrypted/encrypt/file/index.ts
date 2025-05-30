import browser from './browser'
import uploadFile from './node'

export default async (
  path: string | any,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  cidVersion: number = 1,
  uploadProgressCallback?: (data: any) => void
) => {
  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await uploadFile(path, apiKey, publicKey, signedMessage, cidVersion)
  } else {
    return await browser(
      path,
      apiKey,
      publicKey,
      signedMessage,
      cidVersion,
      uploadProgressCallback ||
        (() => {
          return
        })
    )
  }
}
