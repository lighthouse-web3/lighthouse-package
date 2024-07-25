/* istanbul ignore file */
import { decryptFile } from '../encryptionBrowser'
import { lighthouseConfig } from '../../../lighthouse.config'
import { retryFetch } from '../../utils/util'

export default async (
  cid: string,
  fileEncryptionKey: string,
  mimeType: string
) => {
  const response = await retryFetch(
    lighthouseConfig.lighthouseGateway + '/api/v0/cat/' + cid,
    {
      method: 'POST',
      timeout: 7200000,
    }
  )

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.blob()
  const decrypted = await decryptFile(
    await result.arrayBuffer(),
    fileEncryptionKey
  )

  if (decrypted) {
    if (mimeType) {
      return new Blob([decrypted], { type: mimeType })
    } else {
      return new Blob([decrypted])
    }
  } else {
    return null
  }
}
