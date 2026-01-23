import serverSide from './node'
import browser from './browser'
import { UploadOptions, Headers } from '../../../../types'

type EncryptedTextUpload = (
  text: string,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  name: string,
  cidVersion: number,
  headers?: Headers,
) => Promise<any>

export default async (
  text: string,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  name = 'text',
  options: UploadOptions = {
    cidVersion: 1,
    headers: {},
  }
) => {
  const { cidVersion = 1, headers } = options
  const serverSideUpload = serverSide as EncryptedTextUpload
  const browserUpload = browser as EncryptedTextUpload

  //@ts-ignore
  if (typeof window === 'undefined') {
    return await serverSideUpload(
      text,
      apiKey,
      publicKey,
      signedMessage,
      name,
      cidVersion,
      headers
    )
  } else {
    return await browserUpload(
      text,
      apiKey,
      publicKey,
      signedMessage,
      name,
      cidVersion,
      headers
    )
  }
}
