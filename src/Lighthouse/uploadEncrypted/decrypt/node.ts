/* istanbul ignore file */
import axios from 'axios'
import { decryptFile } from '../encryptionNode'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (cid: string, fileEncryptionKey: any) => {
  try {
    const result = await axios.post(
      lighthouseConfig.lighthouseGateway + '/api/v0/cat/' + cid,
      null,
      {
        responseType: 'arraybuffer',
      }
    )

    const decrypted = await decryptFile(
      Buffer.from(result.data),
      fileEncryptionKey
    )
    return decrypted
  } catch (error: any) {
    throw new Error(error.message)
  }
}
