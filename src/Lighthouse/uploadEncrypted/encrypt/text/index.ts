import serverSide from './node'

export default async (
  text: string,
  apiKey: string,
  publicKey: string,
  signedMessage: string
) => {
  return await serverSide(text, apiKey, publicKey, signedMessage)
}
