import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

export type response = {
  data: string
}

export default async (sourcePath: string, authToken: string): Promise<response> => {
  try {
    const endpoint = `${lighthouseConfig.lighthouseDataDepot}/api/upload/upload_files`
    const FormData = eval(`require`)('form-data')
    const fs = eval(`require`)('fs')

    const formData = new FormData()
    formData.append('file', fs.createReadStream(sourcePath))
    const response = await axios.post(endpoint, formData, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${authToken}`,
      },
    })
    return { data: response.data.message }
  } catch (error: any) {
    throw new Error(error)
  }
}
