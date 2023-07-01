import uploadFile from './node'
import uploadFileBrowser from './browser'
import { IUploadProgressCallback } from '../../../types'

export default async (
  path: string | any,
  apiKey: string,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
) => {
  // Upload File to IPFS
  // @ts-expect-error Check Environment
  if (typeof window === 'undefined') {
    return await uploadFile(path, apiKey)
  } else {
    return await uploadFileBrowser(
      path,
      apiKey,
      uploadProgressCallback ||
        (() => {
          return
        })
    )
  }
}
