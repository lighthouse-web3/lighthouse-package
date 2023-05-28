import axios from 'axios'
import FormData from 'form-data'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (buffer: any, apiKey: string, mimeType = '') => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formData = new FormData()

    formData.append('file', buffer)

    const response = await axios.post(endpoint, formData, {
      withCredentials: true,
      maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data; boundary= ${formData.getBoundary()}`,
        Encryption: 'false',
        'Mime-Type': mimeType,
        Authorization: token,
      },
    })

    return { data: response.data }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
