import serverSide from './node'
import browser from './browser'

export default async (
  text: string,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  name = 'text'
) => {
  if (typeof window === 'undefined') {
    return await serverSide(text, apiKey, publicKey, signedMessage, name)
  } else {
    return await browser(text, apiKey, publicKey, signedMessage, name)
  }
}
