/* istanbul ignore file */
import { encryptFile } from '../../encryptionNode'
import { generate, saveShards } from '@lighthouse-web3/kavach'
import { lighthouseConfig } from '../../../../lighthouse.config'
import { fetchWithTimeout } from '../../../utils/util'

export default async (
  text: string,
  apiKey: string,
  publicKey: string,
  signedMessage: string,
  name: string
) => {
  try {
    const token = 'Bearer ' + apiKey
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add'

    // Upload file
    const formData = new FormData()

    const { masterKey: fileEncryptionKey, keyShards } = await generate()

    const encryptedData = await encryptFile(
      Buffer.from(text),
      fileEncryptionKey
    )
    const blob = new Blob([Buffer.from(encryptedData)])
    formData.append('file', blob, name)

    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      body: formData,
      credentials: 'include',
      timeout: 7200000,
      headers: {
        Encryption: 'true',
        'Mime-Type': 'text/plain',
        Authorization: token,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = (await response.json()) as any

    const { error } = await saveShards(
      publicKey,
      responseData[0].Hash,
      signedMessage,
      keyShards
    )

    if (error) {
      throw new Error('Error encrypting file')
    }
    return { data: responseData }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
