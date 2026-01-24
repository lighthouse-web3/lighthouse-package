import uploadTextServer from './node'
import uploadTextBrowser from './browser'
import type { UploadOptions } from '../../../types'

export default async (
  text: string,
  apiKey: string,
  name = 'text',
  options: UploadOptions = {
    cidVersion: 1,
    headers: {},
  }
) => {
  const { cidVersion = 1, headers } = options

  // Upload File to IPFS
  //@ts-ignore
  if (typeof window === 'undefined') {
    return await uploadTextServer(text, apiKey, name, cidVersion, headers)
  } else {
    return await uploadTextBrowser(text, apiKey, name, cidVersion, headers)
  }
}
