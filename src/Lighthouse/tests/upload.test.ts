import axios from 'axios'
import { resolve } from 'path'
import { ethers } from 'ethers'
import lighthouse from '..'
import { lighthouseConfig } from '../../lighthouse.config'

describe('uploadFiles', () => {
  test('upload Main Case File', async () => {
    const path = resolve(process.cwd(), 'src/Lighthouse/tests/testImages/testImage1.svg')
    const publicKey = '0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26'
    const verificationMessage = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/auth/get_message?publicKey=${publicKey}`
      )
    ).data
    const signer = new ethers.Wallet(
      '0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895'
    )
    const signedMessage = await signer.signMessage(verificationMessage)
    const apiKey = await lighthouse.getApiKey(publicKey, signedMessage)

    const deployResponse = await lighthouse.upload(path, apiKey.data.apiKey)

    expect(deployResponse.data).toHaveProperty('Name')
    expect(typeof deployResponse.data['Name']).toBe('string')

    expect(deployResponse.data).toHaveProperty('Hash')
    expect(typeof deployResponse.data['Hash']).toBe('string')

    expect(deployResponse.data).toHaveProperty('Size')
    expect(typeof deployResponse.data['Size']).toBe('string')
  }, 60000)

  test('upload Main Case Folder', async () => {
    const path = resolve(process.cwd(), 'src/Lighthouse/tests/testImages')

    const publicKey = '0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26'
    const verificationMessage = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/auth/get_message?publicKey=${publicKey}`
      )
    ).data
    const provider = ethers.getDefaultProvider()
    const signer = new ethers.Wallet(
      '0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895',
      provider
    )
    const signedMessage = await signer.signMessage(verificationMessage)
    const apiKey = await lighthouse.getApiKey(publicKey, signedMessage)

    const deployResponse = (await lighthouse.upload(path, apiKey.data.apiKey))
      .data

    expect(deployResponse).toHaveProperty('Name')
    expect(typeof deployResponse['Name']).toBe('string')

    expect(deployResponse).toHaveProperty('Hash')
    expect(typeof deployResponse['Hash']).toBe('string')

    expect(deployResponse).toHaveProperty('Size')
    expect(typeof deployResponse['Size']).toBe('string')
  }, 60000)

  test('upload Error Case Wrong Api Key File', async () => {
    try {
      const path = resolve(process.cwd(), 'src/Lighthouse/tests/testImages/testImage1.svg')
      const deployResponse = await lighthouse.upload(path, 'apiKey')
    } catch (error: any) {
      expect(typeof error.message).toBe('string')
    }
  }, 60000)
})
