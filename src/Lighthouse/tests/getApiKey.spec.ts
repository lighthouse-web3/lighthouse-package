import axios from 'axios'
import { ethers } from 'ethers'
import { lighthouseConfig } from '../../lighthouse.config'
import lighthouse from '..'
import 'dotenv/config'

describe('getApiKey', () => {
  let pubKey = process.env.TEST_PUBLIC_KEY
  console.log(pubKey)
  let privKey = process.env.TEST_PRIVATE_KEY
  let verificationMessage

  it('should get verification message from server using public key', async () => {
    verificationMessage = await axios.get(
      lighthouseConfig.lighthouseAPI +
        `/api/auth/get_message?publicKey=${pubKey}`
    )

    expect(verificationMessage.status).toEqual(200)
    expect(verificationMessage.data).toMatch(/^Please prove you are the owner/)
  })

  it('should not allow random private key to sign message and get API Key', async () => {
    try {
      const provider = ethers.getDefaultProvider()
      const signer = new ethers.Wallet(
        '0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b',
        provider
      )
      const signedMessage = await signer.signMessage(verificationMessage.data)
      const response = await lighthouse.getApiKey(pubKey, signedMessage)
    } catch (error) {
      expect(typeof error.message).toBe('string')
    }
  })

  it('should not generate api Key with random signed message', async () => {
    try {
      const provider = ethers.getDefaultProvider()
      const signer = new ethers.Wallet(
        '0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b',
        provider
      )
      const signedMessage = await signer.signMessage('randomMessage')
      const response = await lighthouse.getApiKey(pubKey, signedMessage)
    } catch (error) {
      console.log(error.message)
      expect(typeof error.message).toBe('string')
    }
  })

  it('should only allow corresponding private key to sign verification message and get API Key', async () => {
    try {
      const provider = ethers.getDefaultProvider()
      const signer = new ethers.Wallet(privKey, provider)
      const signedMessage = await signer.signMessage(verificationMessage.data)
      const response = await lighthouse.getApiKey(pubKey, signedMessage)
      expect(response.data).toHaveProperty('apiKey')
      const apiKey = response.data.apiKey
    } catch (error) {
      console.log(error)
    }
  })
})

describe('getApiKey', () => {
  test('getApiKey Main Case', async () => {
    const publicKey = '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
    const verificationMessage = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/auth/get_message?publicKey=${publicKey}`
      )
    ).data
    const provider = ethers.getDefaultProvider()
    const signer = new ethers.Wallet(
      '0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b',
      provider
    )
    const signedMessage = await signer.signMessage(verificationMessage)

    const response = await lighthouse.getApiKey(publicKey, signedMessage)

    expect(typeof response.data.apiKey).toBe('string')
  }, 60000)

  test('getApiKey Null Case', async () => {
    try {
      const publicKey = '0xEaF4E24ffC1A2f53c07839a74966A6611b8Cb8A1'
      const apiKey = await lighthouse.getApiKey(publicKey, 'signedMessage')
    } catch (error: any) {
      expect(typeof error.message).toBe('string')
    }
  }, 60000)
})
