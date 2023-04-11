/* istanbul ignore file */
import axios from 'axios'
import { decryptFile } from '../encryptionBrowser'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (
  cid: string,
  fileEncryptionKey: string,
  mimeType: string
) => {
  const result = await axios.post(
    lighthouseConfig.lighthouseGateway + '/api/v0/cat/' + cid,
    null,
    {
      responseType: 'blob',
    }
  )

  const decrypted = await decryptFile(
    await result.data.arrayBuffer(),
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
