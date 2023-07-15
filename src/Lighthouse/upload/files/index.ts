import uploadFile from './node'
import uploadFileBrowser from './browser'
import { IUploadProgressCallback, IFileUploadedResponse } from '../../../types'

async function uploadFiles(
  sourcePath: string | any,
  apiKey: string,
  multi?: false,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse }>

async function uploadFiles(
  sourcePath: string | any,
  apiKey: string,
  multi?: true,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse[] }>

async function uploadFiles(
  path: string | any,
  apiKey: string,
  multi?: boolean,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
) {
  // Upload File to IPFS

  if (multi) {
    if (typeof window === 'undefined') {
      return await uploadFile(path, apiKey, true)
    } else {
      return await uploadFileBrowser(
        path,
        apiKey,
        true,
        uploadProgressCallback ||
          (() => {
            return
          })
      )
    }
  } else {
    if (typeof window === 'undefined') {
      return await uploadFile(path, apiKey, false)
    } else {
      return await uploadFileBrowser(
        path,
        apiKey,
        false,
        uploadProgressCallback ||
          (() => {
            return
          })
      )
    }
  }
}

export default uploadFiles
