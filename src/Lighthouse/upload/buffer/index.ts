import uploadBuffer from './node'
import uploadTypedArray from './browser'

export default async (buffer: any, apiKey: string, cidVersion: number = 1) => {
  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await uploadBuffer(buffer, apiKey, cidVersion)
  } else {
    return await uploadTypedArray(buffer, apiKey, cidVersion)
  }
}
