/* istanbul ignore file */
import axios from 'axios'
import FormData from 'form-data'
import { lighthouseConfig } from '../../../lighthouse.config'
import { IUploadProgressCallback, UploadFileReturnType, DealParameters } from '../../../types'
import { checkDuplicateFileNames } from '../../utils/util'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async <T extends boolean>(
  files: any,
  accessToken: string,
  multi: boolean,
  dealParameters: DealParameters|undefined,
  uploadProgressCallback: (data: IUploadProgressCallback) => void
): Promise<{ data: UploadFileReturnType<T> }> => {
  try {
    const endpoint =
      lighthouseConfig.lighthouseNode +
      `/api/v0/add?wrap-with-directory=${multi}`
    checkDuplicateFileNames(files)

    const formData = new FormData()
    const boundary = Symbol()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i])
    }

    const token = 'Bearer ' + accessToken

    const response = await axios.post(endpoint, formData, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data; boundary= ${boundary.toString()}`,
        Encryption: `${false}`,
        Authorization: token,
        'X-Deal-Parameter': dealParameters?JSON.stringify(dealParameters):'null'
      },
      onUploadProgress: function (progressEvent) {
        if(progressEvent.total) {
          const _progress = Math.round(progressEvent.loaded / progressEvent.total)
          uploadProgressCallback({
            progress: _progress,
            total: progressEvent.total,
            uploaded: progressEvent.loaded,
          })
        }
      },
    })

    if (typeof response.data === 'string') {
      if(multi){
        response.data = JSON.parse(
          `[${response.data.slice(0, -1)}]`.split('\n').join(',')
        )
      } else {
        const temp = response.data.split('\n')
        response.data = JSON.parse(temp[temp.length - 2])
      }
    }

    return { data: response.data }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
