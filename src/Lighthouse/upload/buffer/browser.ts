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
        Authorization: token,
      },
    })

    if (!response.ok) {
      const res = (await response.json())
      throw new Error(res.error)
    }

    const data = await response.json()

    return { data }
  } catch (error: any) {
    throw new Error(error)
  }
}
