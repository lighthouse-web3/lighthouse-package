import basePathConvert from '../../utils/basePathConvert'
import { lighthouseConfig } from '../../../lighthouse.config'
import { UploadFileReturnType, DealParameters } from '../../../types'

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

export default async <T extends boolean>(
  sourcePath: string,
  apiKey: string,
  multi: boolean,
  dealParameters: DealParameters | undefined
): Promise<{ data: UploadFileReturnType<T> }> => {
  const { createReadStream, lstatSync } = eval(`require`)('fs-extra')
  const path = eval(`require`)('path')

  const token = 'Bearer ' + apiKey
  const stats = lstatSync(sourcePath)
  try {
    const endpoint =
      lighthouseConfig.lighthouseNode +
      `/api/v0/add?wrap-with-directory=${multi}`
    if (stats.isFile()) {
      const data = new FormData()
      const stream = createReadStream(sourcePath)
      const buffers = []
      for await (const chunk of stream) {
        buffers.push(chunk)
      }
      const blob = new Blob(buffers)

      data.set('file', blob, path.basename(sourcePath))

      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          Encryption: 'false',
          Authorization: token,
          'X-Deal-Parameter': dealParameters
            ? JSON.stringify(dealParameters)
            : 'null',
        },
      })

      if (!response.ok) {
        throw new Error(`Request failed with status code ${response.status}`)
      }

      let responseData = (await response.text()) as any
      console.log(responseData)
      if (multi) {
        const temp = responseData.split('\n')
        responseData = JSON.parse(temp[temp.length - 2])
      } else {
        responseData = JSON.parse(responseData)
      }

      return { data: responseData }
    } else {
      const files = await walk(sourcePath)
      const data = new FormData()

      for (const file of files) {
        const stream = createReadStream(file)
        const buffers: any = []
        for await (const chunk of stream) {
          buffers.push(chunk)
        }
        const blob = new Blob(buffers)

        data.set(
          'file',
          blob,
          multi ? path.basename(file) : basePathConvert(sourcePath, file)
        )
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        body: data,
        credentials: 'include',
        headers: {
          Encryption: 'false',
          Authorization: token,
          'X-Deal-Parameter': dealParameters
            ? JSON.stringify(dealParameters)
            : 'null',
        },
      })

      if (!response.ok) {
        throw new Error(`Request failed with status code ${response.status}`)
      }

      let responseData = (await response.text()) as any

      if (typeof responseData === 'string') {
        if (multi) {
          responseData = JSON.parse(
            `[${responseData.slice(0, -1)}]`.split('\n').join(',')
          )
        } else {
          const temp = responseData.split('\n')
          responseData = JSON.parse(temp[temp.length - 2])
        }
      }

      return { data: responseData }
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
