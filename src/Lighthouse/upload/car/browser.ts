/* istanbul ignore file */
import { lighthouseConfig } from '../../../lighthouse.config'
import type { IUploadProgressCallback, IFileUploadedResponse, Headers } from '../../../types'
import { fetchWithTimeout } from '../../utils/util'

export default async (
  file: File,
  accessToken: string,
  headers?: Headers,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse }> => {
  try {
    // Validate that only a single file is provided
    if (!file || !(file instanceof File)) {
      throw new Error('CAR upload requires a single File object')
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext !== 'car') {
      throw new Error('File must have a .car extension')
    }

    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/dag/import'

    const formData = new FormData()
    formData.append('file', file)

    const token = 'Bearer ' + accessToken
    const storageType = headers?.storageType

    const requestHeaders = {
      Authorization: token,
      ...(storageType ? { 'X-Storage-Type': storageType } : {}),
    }

    const response = uploadProgressCallback
      ? await fetchWithTimeout(endpoint, {
          method: 'POST',
          body: formData,
          headers: requestHeaders,
          timeout: 7200000,
          onProgress: (progress) => {
            uploadProgressCallback({
              progress: progress,
            })
          },
        })
      : await fetchWithTimeout(endpoint, {
          method: 'POST',
          body: formData,
          headers: requestHeaders,
          timeout: 7200000,
        })

    if (!response.ok) {
      const res = await response.json()
      throw new Error(res.error)
    }

    const responseData = await response.json()
    return { data: responseData }
  } catch (error: any) {
    throw new Error(error)
  }
}
