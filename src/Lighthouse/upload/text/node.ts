import { lighthouseConfig } from '../../../lighthouse.config'
import { fetchWithTimeout } from '../../utils/util'

export default async (text: string, apiKey: string, name: string, cidVersion: number) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?cid-version=${cidVersion}`

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
