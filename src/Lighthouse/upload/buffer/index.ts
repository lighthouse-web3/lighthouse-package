import uploadBuffer from './node'
import uploadTypedArray from './browser'
import type { UploadOptions } from '../../../types'

export default async (
  buffer: any,
  apiKey: string,
  options: UploadOptions = {
    cidVersion: 1,
    headers: {},
  }
) => {
  const { cidVersion = 1, headers } = options

  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await uploadBuffer(buffer, apiKey, cidVersion, headers)
  } else {
    return await uploadTypedArray(buffer, apiKey, cidVersion, headers)
  }
}
