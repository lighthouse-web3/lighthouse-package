import uploadFile from './node'
import uploadFileBrowser from './browser'
import {
  IUploadProgressCallback,
  IFileUploadedResponse
} from '../../../types'

async function uploadFiles(
  path: string | any,
  apiKey: string,
  cidVersion: number = 1,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse }> {
  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await uploadFile(path, apiKey, cidVersion)
  } else {
    return await uploadFileBrowser(
      path,
      apiKey,
      cidVersion,
      uploadProgressCallback
    )
  }
}

export default uploadFiles
