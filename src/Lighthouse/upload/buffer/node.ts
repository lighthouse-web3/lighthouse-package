import { lighthouseConfig } from '../../../lighthouse.config'

export default async (buffer: any, apiKey: string, cidVersion: number) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?cid-version=${cidVersion}`

    // Upload file
    const blob = new Blob([buffer])
    const formData = new FormData()
    formData.set('file', blob)

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: token
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
