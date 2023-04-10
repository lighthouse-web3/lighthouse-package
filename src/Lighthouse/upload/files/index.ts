import uploadFile from './node'
import uploadFileBrowser from './browser'

export default async (path: string | any, apiKey: string) => {
  // Upload File to IPFS
  if (typeof process !== 'undefined' && process.release.name === 'node') {
    return await uploadFile(path, apiKey)
  } else {
    return await uploadFileBrowser(path, apiKey)
  }
}
