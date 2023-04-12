import axios from 'axios'
import FormData from 'form-data'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (text: string, apiKey: string) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formDdata = new FormData()

    formDdata.append('file', Buffer.from(text))

    const response = await axios.post(endpoint, formDdata, {
      withCredentials: true,
      maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data; boundary= ${formDdata.getBoundary()}`,
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
