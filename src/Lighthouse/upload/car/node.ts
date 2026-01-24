import { lighthouseConfig } from '../../../lighthouse.config'
import { fetchWithDirectStream } from '../../utils/util'
import type { IFileUploadedResponse, IUploadProgressCallback, Headers } from '../../../types'

export default async (
  sourcePath: string,
  apiKey: string,
  headers?: Headers,
  uploadProgressCallback?: (data: IUploadProgressCallback) => void
): Promise<{ data: IFileUploadedResponse }> => {
  const { createReadStream, lstatSync } = eval(`require`)('fs-extra')
  const path = eval(`require`)('path')

  const token = 'Bearer ' + apiKey
  const stats = lstatSync(sourcePath)

  if (!stats.isFile()) {
    throw new Error('CAR upload only supports single file upload')
  }

  // Validate .car extension
  const ext = path.extname(sourcePath).toLowerCase()
  if (ext !== '.car') {
    throw new Error('File must have a .car extension')
  }

  try {
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/dag/import'
    const boundary =
      '----WebKitFormBoundary' + Math.random().toString(16).substr(2)

    const storageType = headers?.storageType
    const requestHeaders = {
      Authorization: token,
      ...(storageType ? { 'X-Storage-Type': storageType } : {}),
    }

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
        headers: requestHeaders,
        timeout: 7200000,
        onProgress: uploadProgressCallback
          ? (data: { progress: number }) => uploadProgressCallback(data)
          : undefined,
      },
      streamData
    )

    return response
  } catch (error: any) {
    throw new Error(error)
  }
}
