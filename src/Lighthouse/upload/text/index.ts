import uploadTextServer from './node'
import uploadTextBrowser from './browser'

export default async (text: string, apiKey: string, name='text') => {
  // Upload File to IPFS
  if (typeof process !== 'undefined' && process.release.name === 'node') {
    return await uploadTextServer(text, apiKey, name)
  } else {
    return await uploadTextBrowser(text, apiKey, name)
  }
}
