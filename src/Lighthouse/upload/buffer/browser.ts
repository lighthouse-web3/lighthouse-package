import { lighthouseConfig } from '../../../lighthouse.config'

export default async (blob: any, apiKey: string, mimeType = '') => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formData = new FormData()
    formData.set('file', blob)

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Mime-Type': mimeType,
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
