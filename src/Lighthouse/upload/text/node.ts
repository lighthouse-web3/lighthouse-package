import { Blob } from 'buffer'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (text: string, apiKey: string, name: string) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formData = new FormData()
    const blob = new Blob([Buffer.from(text)])

    formData.set('file', blob, name)

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        Encryption: 'false',
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
