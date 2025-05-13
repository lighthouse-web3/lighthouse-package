/* istanbul ignore file */
import { lighthouseConfig } from '../../../lighthouse.config'
import { DealParameters, IUploadProgressCallback } from '../../../types'
import { fetchWithTimeout } from '../../utils/util'

export default async (
  carFile: File,
  apiKey: string,
  dealParameters?: DealParameters,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<any> => {
  try {
    const endpoint = lighthouseConfig.lighthouseNode + `/api/v0/dag/import`
    const token = 'Bearer ' + apiKey

    const formData = new FormData()
    formData.append('file', carFile)

    const headers = new Headers({
      Authorization: token,
      'X-Deal-Parameter': dealParameters
        ? JSON.stringify(dealParameters)
        : 'null',
    })

    const response = uploadProgressCallback
      ? await fetchWithTimeout(endpoint, {
          method: 'POST',
          body: formData,
          headers: headers,
          timeout: 7200000, // 2 hour timeout
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
      throw new Error(`CAR upload failed: ${response.status}`)
    }

    const res = await response.json()
    return { data: res }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
