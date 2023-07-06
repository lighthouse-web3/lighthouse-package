/* istanbul ignore file */
import axios from 'axios'
import FormData from 'form-data'
import { lighthouseConfig } from '../../../lighthouse.config'
import { IFileUploadedResponse, IUploadProgressCallback } from '../../../types'
import { checkDuplicateFileNames } from '../../utils/util'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async (
  files: any,
  accessToken: string,
  multi: boolean,
  uploadProgressCallback: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse[] }> => {
  try {
    const endpoint =
      lighthouseConfig.lighthouseNode + `/api/v0/add?wrap-with-directory=${multi}`
    let mimeType = null
    if (files.length === 1) {
      mimeType = files[0].type
    }
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
        'Mime-Type': mimeType,
        Authorization: token,
      },
      onUploadProgress: function (progressEvent) {
        const _progress = Math.round(progressEvent.loaded / progressEvent.total)
        uploadProgressCallback({
          progress: _progress,
          total: progressEvent.total,
          uploaded: progressEvent.loaded,
        })
      },
    })

    if (typeof response.data === 'string' && multi) {
      response.data = JSON.parse(
        `[${response.data.slice(0, -1)}]`.split('\n').join(',')
      )
    } else {
      response.data = response.data
    }

    return { data: response.data }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
