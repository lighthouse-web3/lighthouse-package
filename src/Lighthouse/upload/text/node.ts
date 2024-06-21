import axios from 'axios'
import { FormData } from 'formdata-node';
import { Blob } from 'buffer';
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (text: string, apiKey: string, name: string) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formData = new FormData()
    const blob = new Blob([Buffer.from(text)]);

    formData.set('file', blob, name)

    const response = await axios.post(endpoint, formData, {
      withCredentials: true,
      maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data;`,
        Encryption: 'false',
        'Mime-Type': 'text/plain',
        Authorization: token,
      },
    })

    return { data: response.data }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
