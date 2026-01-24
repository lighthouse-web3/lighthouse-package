import { lighthouseConfig } from '../../../lighthouse.config'
import type { Headers } from '../../../types'

export default async (
  buffer: any,
  apiKey: string,
  cidVersion: number,
  headers?: Headers
) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?cid-version=${cidVersion}`
    const storageType = headers?.storageType

    // Upload file
    const blob = new Blob([buffer])
    const formData = new FormData()
    formData.set('file', blob)

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: token,
        ...(storageType ? { 'X-Storage-Type': storageType } : {}),
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
