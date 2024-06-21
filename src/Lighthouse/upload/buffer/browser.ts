import axios from 'axios'
import { FormData } from 'formdata-node';
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (blob: any, apiKey: string, mimeType = '') => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formData = new FormData();
    formData.set("file", blob);
    const boundary = Symbol()

    const response = await axios.post(endpoint, formData, {
      withCredentials: false,
      maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data; boundary= ${boundary.toString()}`,
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
