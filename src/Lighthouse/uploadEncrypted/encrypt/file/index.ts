import browser from './browser'
import uploadFile from './node'
import { UploadFilesOptions } from '../../../../types'

export default async (
  path: string | any,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  cidVersionOrOptions: number | UploadFilesOptions = 1,
  uploadProgressCallback?: (data: any) => void
) => {
  // Normalize to options object (hybrid support)
  const options: UploadFilesOptions =
    typeof cidVersionOrOptions === 'number'
      ? {
          cidVersion: cidVersionOrOptions,
          onProgress: uploadProgressCallback,
        }
      : cidVersionOrOptions

  const { cidVersion = 1, onProgress, headers } = options
  const progressCallback =
    onProgress ||
    uploadProgressCallback ||
    (() => {
      return
    })

  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await uploadFile(
      path,
      apiKey,
      publicKey,
      signedMessage,
      cidVersion,
      headers
    )
  } else {
    return await browser(
      path,
      apiKey,
      publicKey,
      signedMessage,
      cidVersion,
      headers,
      progressCallback,
    )
  }
}
