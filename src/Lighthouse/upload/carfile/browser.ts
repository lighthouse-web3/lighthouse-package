/* istanbul ignore file */
import { lighthouseConfig } from '../../../lighthouse.config'
import {
  DealParameters,
  IUploadProgressCallback,
  IFileUploadedResponse,
} from '../../../types'
import { fetchWithTimeout } from '../../utils/util'

export default async (
  file: File,
  apiKey: string,
  dealParameters?: DealParameters,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<any> => {
  try {
    const endpoint = lighthouseConfig.lighthouseNode + `/api/v0/dag/import`
    const token = 'Bearer ' + apiKey

    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: file.type })

    const formData = new FormData()
    formData.append('file', blob, file.name)

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
          timeout: 7200000,
          onProgress: (progress) => {
            uploadProgressCallback({ progress })
          },
        })
      : await fetchWithTimeout(endpoint, {
          method: 'POST',
          body: formData,
          headers: headers,
          timeout: 7200000,
        })

    if (!response.ok) {
      throw new Error(`CAR upload failed with status code ${response.status}`)
    }

    const responseText = await response.text()
    const result: IFileUploadedResponse | IFileUploadedResponse[] =
      JSON.parse(responseText)

    return result
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
