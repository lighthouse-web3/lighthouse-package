import uploadFile from './node'
import uploadFileBrowser from './browser'
import {
  IUploadProgressCallback,
  IFileUploadedResponse,
  UploadFilesOptions
} from '../../../types'

async function uploadFiles(
  path: string | any,
  apiKey: string,
  cidVersionOrOptions: number | UploadFilesOptions = 1,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse }> {
  // Normalize to options object (hybrid support)
  const options: UploadFilesOptions =
    typeof cidVersionOrOptions === 'number'
      ? {
          cidVersion: cidVersionOrOptions,
          onProgress: uploadProgressCallback,
        }
      : cidVersionOrOptions

  const { cidVersion = 1, onProgress, headers } = options

  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await uploadFile(path, apiKey, cidVersion, headers, onProgress)
  } else {
    return await uploadFileBrowser(path, apiKey, cidVersion, headers, onProgress)
  }
}

export default uploadFiles
