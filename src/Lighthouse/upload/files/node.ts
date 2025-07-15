import basePathConvert from '../../utils/basePathConvert'
import { lighthouseConfig } from '../../../lighthouse.config'
import { fetchWithDirectStream } from '../../utils/util'
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
    const boundary =
      '----WebKitFormBoundary' + Math.random().toString(16).substr(2)

    const headers = {
      Authorization: token,
    }

    if (stats.isFile()) {
      const stream = createReadStream(sourcePath)
      const streamData = {
        boundary,
        files: [
          {
            stream,
            filename: path.basename(sourcePath),
          },
        ],
      }

      const response = await fetchWithDirectStream(
        endpoint,
        {
          method: 'POST',
          headers,
          timeout: 7200000,
        },
        streamData
      )

      return response
    } else {
      // Handle directory upload
      const files = await walk(sourcePath)

      const streamData = {
        boundary,
        files: files.map((file) => ({
          stream: createReadStream(file),
          filename: basePathConvert(sourcePath, file),
        })),
      }

      const response = await fetchWithDirectStream(
        endpoint,
        {
          method: 'POST',
          headers,
          timeout: 7200000,
        },
        streamData
      )

      return response
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
