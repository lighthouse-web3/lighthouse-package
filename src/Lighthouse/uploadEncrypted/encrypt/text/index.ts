import serverSide from './node'

export default async (
  text: string,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  name= 'text'
) => {
  return await serverSide(text, apiKey, publicKey, signedMessage, name)
}
