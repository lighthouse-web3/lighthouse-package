/* istanbul ignore file */
import { lighthouseConfig } from '../../../lighthouse.config'
import {
  IUploadProgressCallback,
  IFileUploadedResponse
} from '../../../types'
import { resilientUpload } from '../../utils/resilientUpload'

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default async (
  files: any,
  accessToken: string,
  cidVersion: number,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse }>  => {
  try {
    const isDirectory = [...files].some(file => file.webkitRelativePath)
    let endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?wrap-with-directory=false&cid-version=${cidVersion}`

    if(!isDirectory && files.length > 1) {
      endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?wrap-with-directory=true&cid-version=${cidVersion}`
    }

    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i])
    }

    const token = 'Bearer ' + accessToken

    const headers = new Headers({
      Authorization: token
    })

    const response = await resilientUpload(endpoint, {
      method: 'POST',
      body: formData,
      headers: headers,
      onProgress: uploadProgressCallback ? (progress) => {
        uploadProgressCallback({
          progress: progress,
        })
      } : undefined,
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
