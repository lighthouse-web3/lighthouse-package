import axios from 'axios'
import { ethers } from 'ethers'
import { lighthouseConfig } from '../../lighthouse.config'
import lighthouse from '..'
import 'dotenv/config'

describe('getApiKey', () => {
  let publicKey = process.env.TEST_PUBLIC_KEY as string
  let privateKey = process.env.TEST_PRIVATE_KEY as string
  let verificationMessage: any

  it('should get verification message from server using public key', async () => {
    verificationMessage = await axios.get(
      lighthouseConfig.lighthouseAPI +
        `/api/auth/get_message?publicKey=${publicKey}`
    )

    expect(verificationMessage.status).toEqual(200)
    expect(verificationMessage.data).toMatch(/^Please prove you are the owner/)
  }, 60000)

  it('should not allow random private key to sign message and get API Key', async () => {
    try {
      const provider = ethers.getDefaultProvider('homestead')
      const signer = new ethers.Wallet(
        '0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b',
        provider
      )
      const signedMessage = await signer.signMessage(verificationMessage.data)
      const response = await lighthouse.getApiKey(publicKey, signedMessage)
    } catch (error) {
      expect(typeof error.message).toBe('string')
    }
  }, 60000)

  it('should not generate api Key with random signed message', async () => {
    try {
      const provider = ethers.getDefaultProvider('homestead')
      const signer = new ethers.Wallet(
        '0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b',
        provider
      )
      const signedMessage = await signer.signMessage('randomMessage')
      const response = await lighthouse.getApiKey(publicKey, signedMessage)
    } catch (error) {
      console.log(error.message)
      expect(typeof error.message).toBe('string')
    }
  }, 60000)

  it('should only allow corresponding private key to sign verification message and get API Key', async () => {
    try {
      const provider = ethers.getDefaultProvider('homestead')
      const signer = new ethers.Wallet(privateKey, provider)
      const signedMessage = await signer.signMessage(verificationMessage.data)
      const response = await lighthouse.getApiKey(publicKey, signedMessage)
      expect(response.data).toHaveProperty('apiKey')
      const apiKey = response.data.apiKey
    } catch (error) {
      console.log(error)
    }
  }, 60000)
})
