/* istanbul ignore file */
import { lighthouseConfig } from '../../../lighthouse.config'
import {
  IUploadProgressCallback,
  UploadFileReturnType,
  DealParameters,
} from '../../../types'
import { checkDuplicateFileNames, retryFetch } from '../../utils/util'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async <T extends boolean>(
  files: any,
  accessToken: string,
  multi: boolean,
  dealParameters: DealParameters | undefined,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: UploadFileReturnType<T> }> => {
  try {
    const endpoint =
      lighthouseConfig.lighthouseNode +
      `/api/v0/add?wrap-with-directory=${multi}`
    checkDuplicateFileNames(files)

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
      ? await retryFetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: headers,
          timeout: 7200000,
          onProgress: (progress) => {
            uploadProgressCallback({
              progress: progress,
              total: 100, // We don't have the total size here, so we're using 100 as a percentage
              uploaded: progress * 100,
            })
          },
        })
      : await retryFetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: headers,
          timeout: 7200000,
        })

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`)
    }

    const responseText = await response.text()

    let data
    if (typeof responseText === 'string') {
      if (multi) {
        data = JSON.parse(
          `[${responseText.slice(0, -1)}]`.split('\n').join(',')
        )
      } else {
        const temp = responseText.split('\n')
        data = JSON.parse(temp[temp.length - 2])
      }
    }

    return { data }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
