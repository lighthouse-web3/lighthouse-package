import browser from './browser'
import uploadFile from './node'
import { DealParameters } from '../../../../types'

export default async (
  path: string | any,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  dealParameters?: DealParameters,
  uploadProgressCallback?: (data: any) => void
) => {
  // Upload File to IPFS
  // @ts-expect-error
  if (typeof window === 'undefined') {
    return await uploadFile(path, apiKey, publicKey, signedMessage, dealParameters)
  } else {
    return await browser(
      path,
      apiKey,
      publicKey,
      signedMessage,
      dealParameters,
      uploadProgressCallback ||
        (() => {
          return
        })
    )
  }
}
