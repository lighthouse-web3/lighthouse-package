import basePathConvert from '../../utils/basePathConvert'
import { lighthouseConfig } from '../../../lighthouse.config'
import { fetchWithTimeout } from '../../utils/util'
import { IFileUploadedResponse } from '../../../types'
export async function walk(dir: string) {
  const { readdir, stat } = eval(`require`)('fs-extra')
  let results: string[] = []
  const files = await readdir(dir)

  for (const file of files) {
    const filePath = `${dir}/${file}`
    const _stat = await stat(filePath)

    if (_stat.isDirectory()) {
      results = results.concat(await walk(filePath))
    } else {
      results.push(filePath)
    }
  }

  return results
}

export default async (
  sourcePath: string,
  apiKey: string,
  cidVersion: number
): Promise<{ data: IFileUploadedResponse }> => {
  const { createReadStream, lstatSync } = eval(`require`)('fs-extra')
  const path = eval(`require`)('path')

  const token = 'Bearer ' + apiKey
  const stats = lstatSync(sourcePath)
  try {
    const endpoint =
      lighthouseConfig.lighthouseNode +
      `/api/v0/add?wrap-with-directory=false&cid-version=${cidVersion}`
    if (stats.isFile()) {
      const data = new FormData()
      const stream = createReadStream(sourcePath)
      const buffers: Buffer[] = []
      for await (const chunk of stream) {
        buffers.push(chunk)
      }
      const blob = new Blob(buffers)

      data.append('file', blob, path.basename(sourcePath))

      const response = await fetchWithTimeout(endpoint, {
        method: 'POST',
        body: data,
        timeout: 7200000,
        headers: {
          Authorization: token
        },
      })

      if (!response.ok) {
        const res = (await response.json())
        throw new Error(res.error)
      }

      const responseData = (await response.json())
      return { data: responseData }
    } else {
      const files = await walk(sourcePath)
      const data = new FormData()

      for (const file of files) {
        const stream = createReadStream(file)
        const buffers: Buffer[] = []
        for await (const chunk of stream) {
          buffers.push(chunk)
        }
        const blob = new Blob(buffers)

        data.append(
          'file',
          blob,
          basePathConvert(sourcePath, file)
        )
      }

      const response = await fetchWithTimeout(endpoint, {
        method: 'POST',
        body: data,
        timeout: 7200000,
        headers: {
          Authorization: token
        },
      })

      if (!response.ok) {
        const res = (await response.json())
        throw new Error(res.error)
      }

      const responseData = (await response.json())
      return { data: responseData }
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
