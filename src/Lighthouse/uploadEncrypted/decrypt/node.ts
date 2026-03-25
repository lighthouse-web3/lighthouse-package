/* istanbul ignore file */
import { decryptFile } from '../encryptionNode'
import { lighthouseConfig } from '../../../lighthouse.config'
import { fetchWithTimeout } from '../../utils/util'

export default async (cid: string, fileEncryptionKey: any, gatewayUrl?: string) => {
  try {
    const gateway = gatewayUrl || lighthouseConfig.lighthouseGateway
    const response = await fetchWithTimeout(
      gateway + '/api/v0/cat/' + cid,
      {
        method: 'POST',
        timeout: 7200000,
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
