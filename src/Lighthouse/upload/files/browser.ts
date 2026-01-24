/* istanbul ignore file */
import { lighthouseConfig } from '../../../lighthouse.config'
import {
  IUploadProgressCallback,
  IFileUploadedResponse
} from '../../../types'
import { fetchWithTimeout } from '../../utils/util'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async (
  files: any,
  accessToken: string,
  cidVersion: number,
  optionsHeaders?: { storageType?: string },
  uploadProgressCallback?: (data: IUploadProgressCallback) => void,
): Promise<{ data: IFileUploadedResponse }>  => {
  try {
    const isDirectory = [...files].some(file => file.webkitRelativePath)
    
    const storageType = optionsHeaders?.storageType

    // Build query string with allowed params only
    const baseParams = {
      'cid-version': String(cidVersion),
    }
    
    const queryParams = new URLSearchParams({
      'wrap-with-directory': 'false',
      ...baseParams,
    })
    let endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?${queryParams.toString()}`

    if(!isDirectory && files.length > 1) {
      const wrapParams = new URLSearchParams({
        'wrap-with-directory': 'true',
        ...baseParams,
      })
      endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?${wrapParams.toString()}`
    }

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i])
    }

    const token = 'Bearer ' + accessToken

    const headers = new Headers({
      Authorization: token,
      ...(storageType ? { 'X-Storage-Type': storageType } : {}),
    })

    const response = uploadProgressCallback
      ? await fetchWithTimeout(endpoint, {
          method: 'POST',
          body: formData,
          headers: headers,
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
          headers: headers,
          timeout: 7200000,
        })

    if (!response.ok) {
      const res = (await response.json())
      throw new Error(res.error)
    }

    const responseData = (await response.json())
    return { data: responseData }
  } catch (error: any) {
    throw new Error(error)
  }
}
