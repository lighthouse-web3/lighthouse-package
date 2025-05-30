import uploadFile from './node'
import uploadFileBrowser from './browser'
import {
  IUploadProgressCallback,
  IFileUploadedResponse
} from '../../../types'

async function uploadFiles(
  sourcePath: string | any,
  apiKey: string,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse }>

async function uploadFiles(
  sourcePath: string | any,
  apiKey: string,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse[] }>

async function uploadFiles(
  path: string | any,
  apiKey: string,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
) {
  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await uploadFile(path, apiKey)
  } else {
    return await uploadFileBrowser(
      path,
      apiKey,
      uploadProgressCallback
    )
  }
}

export default uploadFiles
