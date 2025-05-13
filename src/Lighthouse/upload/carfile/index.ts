import uploadCarFile from './node'
import uploadCarFileBrowser from './browser'
import { DealParameters, IUploadProgressCallback } from '../../../types'

// Type overloads for the function
async function uploadCarFiles(
  path: string,
  apiKey: string,
  dealParameters?: DealParameters,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ cid: string }>

async function uploadCarFiles(
  path: File,
  apiKey: string,
  dealParameters?: DealParameters,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ cid: string }>

// Actual function implementation
async function uploadCarFiles(
  path: string | File,
  apiKey: string,
  dealParameters?: DealParameters,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ cid: string }> {
  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await uploadCarFile(path as string, apiKey, dealParameters)
  } else {
    return await uploadCarFileBrowser(
      path as File,
      apiKey,
      dealParameters,
      uploadProgressCallback
    )
  }
}

export default uploadCarFiles
