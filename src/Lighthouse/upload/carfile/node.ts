import { lighthouseConfig } from '../../../lighthouse.config'
import { DealParameters } from '../../../types'
import { fetchWithTimeout } from '../../utils/util'

export default async (
  carFilePath: string,
  apiKey: string,
  dealParameters?: DealParameters
): Promise<any> => {
  const { createReadStream } = eval(`require`)('fs-extra')
  const path = eval(`require`)('path')

  const token = 'Bearer ' + apiKey

  try {
    const endpoint = lighthouseConfig.lighthouseNode + `/api/v0/dag/import`

    const stream = createReadStream(carFilePath)
    const buffers: Buffer[] = []
    for await (const chunk of stream) {
      buffers.push(chunk)
    }
    const blob = new Blob(buffers)

    const data = new FormData()
    data.append('file', blob, path.basename(carFilePath))

    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      body: data,
      timeout: 7200000,
      headers: {
        Authorization: token,
        'X-Deal-Parameter': dealParameters
          ? JSON.stringify(dealParameters)
          : 'null',
      },
    })

    if (!response.ok) {
      throw new Error(`CAR upload failed: ${response.status}`)
    }

    const res = await response.json()
    return { data: res }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
