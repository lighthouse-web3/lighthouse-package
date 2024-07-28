import { lighthouseConfig } from '../../../lighthouse.config'
import { fetchWithTimeout } from '../../utils/util'

export default async (text: string, apiKey: string, name: string) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formData = new FormData()
    const blob = new Blob([Buffer.from(text)])

    formData.append('file', blob, name)

    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      timeout: 7200000,
      headers: {
        'Mime-Type': 'text/plain',
        Authorization: token,
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`)
    }

    const data = await response.json()
    return { data }
  } catch (error: any) {
    throw new Error(error?.message)
  }
}
