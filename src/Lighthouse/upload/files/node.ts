import axios from 'axios'
import FormData from 'form-data'
import basePathConvert from '../../utils/basePathConvert'
import { lighthouseConfig } from '../../../lighthouse.config'

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

/*
  This function is used to deploy a file to the Lighthouse server.
  It takes the following parameters:
  @param {string} sourcePath - The path of file/folder.
  @param {string} apiKey - The api key of the user.
*/

export default async (sourcePath: string, apiKey: string, multi: boolean) => {
  const { createReadStream, lstatSync } = eval(`require`)('fs-extra')
  const mime = eval(`require`)('mime-types')

  const token = 'Bearer ' + apiKey
  const stats = lstatSync(sourcePath)
  try {
    const endpoint = lighthouseConfig.lighthouseNode + `/api/v0/add?wrap-with-directory=${multi}`
    if (stats.isFile()) {
      //we need to create a single read stream instead of reading the directory recursively
      const data = new FormData()
      const mimeType = mime.lookup(sourcePath)

      data.append('file', createReadStream(sourcePath))

      const response = await axios.post(endpoint, data, {
        withCredentials: true,
        maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
        maxBodyLength: Infinity,
        headers: {
          'Content-type': `multipart/form-data; boundary= ${data.getBoundary()}`,
          Encryption: 'false',
          'Mime-Type': `${mimeType}`,
          Authorization: token,
        },
      })

      return { data: response.data }
    } else {
      const files = await walk(sourcePath)
      const data = new FormData()
      const mimeType = mime.lookup(sourcePath)

      files.forEach((file: any) => {
        //for each file stream, we need to include the correct relative file path
        data.append('file', createReadStream(file), {
          filepath: basePathConvert(sourcePath, file),
        })
      })

      const response = await axios.post(endpoint, data, {
        withCredentials: true,
        maxContentLength: Infinity,
        maxBodyLength: Infinity, //this is needed to prevent axios from erroring out with large directories
        headers: {
          'Content-type': `multipart/form-data; boundary= ${data.getBoundary()}`,
          Encryption: 'false',
          'Mime-Type': `${mimeType}`,
          Authorization: token,
        },
      })

      if (typeof response.data === 'string' && multi) {
        response.data = JSON.parse(
          `[${response.data.slice(0, -1)}]`.split('\n').join(',')
        )
      } else {
        const temp = response.data.split('\n')
        response.data = JSON.parse(temp[temp.length - 2])
      }

      /*
        {
          data: {
            Name: 'flow1.png',
            Hash: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
            Size: '31735' 
          }
        }
      */
      return { data: response.data }
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
