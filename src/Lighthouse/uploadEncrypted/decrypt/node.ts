/* istanbul ignore file */
import { decryptFile } from '../encryptionNode'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (cid: string, fileEncryptionKey: any) => {
  try {
    const response = await fetch(
      lighthouseConfig.lighthouseGateway + '/api/v0/cat/' + cid,
      {
        method: 'POST',
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const result = Buffer.from(arrayBuffer)

    const decrypted = await decryptFile(result, fileEncryptionKey)
    return decrypted
  } catch (error: any) {
    throw new Error(error.message)
  }
}
