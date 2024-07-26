import uploadFile from './node'
import uploadFileBrowser from './browser'
import {
  IUploadProgressCallback,
  IFileUploadedResponse,
  DealParameters,
} from '../../../types'

async function uploadFiles(
  sourcePath: string | any,
  apiKey: string,
  multi?: false,
  dealParameters?: DealParameters,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse }>

async function uploadFiles(
  sourcePath: string | any,
  apiKey: string,
  multi?: true,
  dealParameters?: DealParameters,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse[] }>

async function uploadFiles(
  path: string | any,
  apiKey: string,
  multi?: boolean,
  dealParameters?: DealParameters,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
) {
  // Upload File to IPFS

  if (multi) {
    //@ts-ignore
    if (typeof window === 'undefined') {
      return await uploadFile(path, apiKey, true, dealParameters)
    } else {
      return await uploadFileBrowser(
        path,
        apiKey,
        true,
        dealParameters,
        uploadProgressCallback
      )
    }
  } else {
    //@ts-ignore
    if (typeof window === 'undefined') {
      return await uploadFile(path, apiKey, false, dealParameters)
    } else {
      return await uploadFileBrowser(
        path,
        apiKey,
        false,
        dealParameters,
        uploadProgressCallback
      )
    }
  }
}

export default uploadFiles
