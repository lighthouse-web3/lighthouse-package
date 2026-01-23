import uploadCARNode from './node'
import uploadCARBrowser from './browser'
import type { IFileUploadedResponse, IUploadProgressCallback, UploadFilesOptions } from '../../../types'

/**
 * Upload a CAR (Content Addressable aRchive) file to Lighthouse
 * @param pathOrFile - File path (Node.js) or File object (browser)
 * @param apiKey - Lighthouse API key
 * @param options - Optional options for the upload
 * @returns Promise with uploaded file data
 */
async function uploadCAR(
  pathOrFile: string | File,
  apiKey: string,
  options: UploadFilesOptions = {
    headers: {},
    onProgress: (data: IUploadProgressCallback) => {
      return
    },
  }
): Promise<{ data: IFileUploadedResponse }> {
  const { cidVersion = 1, headers, onProgress } = options

  // @ts-ignore
  if (typeof window === 'undefined') {
    // Node.js environment
    if (typeof pathOrFile !== 'string') {
      throw new Error('In Node.js environment, provide a file path string')
    }
    return await uploadCARNode(pathOrFile, apiKey, headers, onProgress)
  } else {
    // Browser environment
    if (typeof pathOrFile === 'string') {
      throw new Error('In browser environment, provide a File object')
    }
    return await uploadCARBrowser(pathOrFile as File, apiKey, headers, onProgress)
  }
}

export default uploadCAR
