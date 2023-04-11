import axios from 'axios'
import FormData from 'form-data'
import { Buffer } from 'buffer'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (text: string, apiKey: string) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formDdata = new FormData()
    const boundary = Symbol()
    formDdata.append('file', Buffer.from(text))

    const response = await axios.post(endpoint, formDdata, {
      withCredentials: false,
      maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
      maxBodyLength: Infinity,
      headers: {
        'Content-type': `multipart/form-data; boundary= ${boundary.toString()}`,
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
