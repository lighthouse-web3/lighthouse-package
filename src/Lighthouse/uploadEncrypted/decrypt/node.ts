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
        headers: {
          ContentType: 'application/json',
          Accept: 'application/octet-stream',
          responseType: 'arraybuffer',
        },
      }
    )
    /*
      response:
        ArrayBuffer
    */
    const decrypted = await decryptFile(result.data, fileEncryptionKey)
    return decrypted
  } catch (error: any) {
    throw new Error(error.message)
  }
}
