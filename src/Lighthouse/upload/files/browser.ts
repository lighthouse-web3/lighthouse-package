/* istanbul ignore file */
import { lighthouseConfig } from '../../../lighthouse.config'
import {
  IUploadProgressCallback,
  UploadFileReturnType,
  DealParameters,
} from '../../../types'
import file from '../../uploadEncrypted/encrypt/file'
import { fetchWithTimeout } from '../../utils/util'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async <T extends boolean>(
  files: any,
  accessToken: string,
  dealParameters: DealParameters | undefined,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: UploadFileReturnType<T> }> => {
  try {
    const isDirectory = files.length === 1 && files[0].webkitRelativePath
    let endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?wrap-with-directory=false`

    if(!isDirectory && files.length > 1) {
      endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?wrap-with-directory=true`
    }

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i])
    }

    const token = 'Bearer ' + accessToken

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
      throw new Error(`Request failed with status code ${response.status}`)
    }

    const responseText = await response.text()
    console.log(responseText)
    console.log(typeof(responseText))

    return { data: JSON.parse(responseText) }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
