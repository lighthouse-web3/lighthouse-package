import axios from 'axios'
import { resolve } from 'path'
import { ethers } from 'ethers'
import lighthouse from '..'
import { lighthouseConfig } from '../../lighthouse.config'
import { getJWT } from '@lighthouse-web3/kavach'
import 'dotenv/config'

export const signAuthMessage = async (privateKey: string) => {
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = new ethers.Wallet(privateKey, provider)
  const messageRequested = (await lighthouse.getAuthMessage(signer.address))
    .data.message
  const signedMessage = await signer.signMessage(messageRequested)
  return signedMessage
}

describe('uploadEncrypted', () => {
  const publicKey = process.env.TEST_PUBLIC_KEY
  const privateKey = process.env.TEST_PRIVATE_KEY
  const apiKey = process.env.TEST_API_KEY

  const path = resolve(
    process.cwd(),
    'src/Lighthouse/tests/testImages/testImage1.svg'
  )
  const fileName = path.split('/').slice(-1)[0]

  it('should encypt-upload file with correct public-private key pair and apiKey', async () => {
    const signedMessageEncryption = await signAuthMessage(privateKey)

    const deployResponse = (
      await lighthouse.uploadEncrypted(
        path,
        apiKey,
        publicKey,
        signedMessageEncryption
      )
    ).data[0]
    expect(deployResponse).toHaveProperty('Name')
    expect(deployResponse).toHaveProperty('Hash')
    expect(deployResponse).toHaveProperty('Size')

    expect(deployResponse['Name']).toBe(fileName)
    expect(typeof deployResponse['Hash']).toBe('string')
    expect(typeof deployResponse['Size']).toBe('string')
  }, 60000)

  it('should encypt-upload folder with correct public-private key pair and apiKey', async () => {
    const folderPath = resolve(
      process.cwd(),
      'src/Lighthouse/tests/testImages/'
    )
    const signedMessageEncryption = await signAuthMessage(privateKey)

    const { JWT } = await getJWT(publicKey, signedMessageEncryption)

    const full_deployResponse = (
      await lighthouse.uploadEncrypted(folderPath, apiKey, publicKey, JWT || '')
    ).data
    expect(full_deployResponse.length).toBeGreaterThan(1)
    const deployResponse = full_deployResponse[0]

    expect(deployResponse).toHaveProperty('Name')
    expect(deployResponse).toHaveProperty('Hash')
    expect(deployResponse).toHaveProperty('Size')

    expect(deployResponse).toHaveProperty('Name')
    expect(typeof deployResponse['Hash']).toBe('string')
    expect(typeof deployResponse['Size']).toBe('string')
  }, 60000)

  it('should not encypt-upload file with incorrect public-private key pair', async () => {
    try {
      const randomPrivateKey =
        '0x8488d2c632da07a93647d7cf701ab6728a884467b1595f3c94007977a20b3539'
      const signedMessageEncryption = await signAuthMessage(randomPrivateKey)

      const deployResponse = await lighthouse.uploadEncrypted(
        path,
        apiKey,
        publicKey,
        signedMessageEncryption
      )
    } catch (error) {
      expect(error.message).toBe('Error encrypting file')
    }
  }, 60000)

  it('should not encypt-upload file with invalid apiKey', async () => {
    try {
      const signedMessageEncryption = await signAuthMessage(privateKey)
      const invalidApiKey = 'invalid.APIKey'
      const deployResponse = await lighthouse.uploadEncrypted(
        path,
        invalidApiKey,
        publicKey,
        signedMessageEncryption
      )
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 500')
    }
  }, 60000)
})
