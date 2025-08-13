import basePathConvert from '../../utils/basePathConvert'
import { lighthouseConfig } from '../../../lighthouse.config'
import { fetchWithDirectStream } from '../../utils/util'
import { IFileUploadedResponse, IUploadProgressCallback } from '../../../types'
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
  cidVersion: number,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
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
            size: stats.size,
          },
        ],
      }

      const response = await fetchWithDirectStream(
        endpoint,
        {
          method: 'POST',
          headers,
          timeout: 7200000,
          onProgress: uploadProgressCallback
            ? (data: { progress: number }) => uploadProgressCallback(data)
            : undefined,
        },
        streamData
      )

      return response
    } else {
      // Handle directory upload
      const files = await walk(sourcePath)

      const createStreamData = () => ({
        boundary,
        files: files.map((file) => {
          const fileStats = lstatSync(file)
          return {
            stream: createReadStream(file),
            filename: basePathConvert(sourcePath, file),
            size: fileStats.size,
          }
        }),
      })

      const streamData = createStreamData()

      const response = await fetchWithDirectStream(
        endpoint,
        {
          method: 'POST',
          headers,
          timeout: 7200000,
          onProgress: uploadProgressCallback
            ? (data: { progress: number }) => uploadProgressCallback(data)
            : undefined,
        },
        streamData
      )

      return response
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
