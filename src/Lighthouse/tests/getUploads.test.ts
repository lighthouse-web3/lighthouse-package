import {ethers} from 'ethers'
import axios from 'axios'
import lighthouse from '..'
import { lighthouseConfig } from '../../lighthouse.config'

describe('getUpload', () => {
  test('getUploads', async () => {
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
    const apiKey = response.data.apiKey
    const res = await lighthouse.getUploads(
      apiKey
    )

    expect(typeof res.data.fileList[0]['cid']).toBe('string')
  }, 20000)

  test('getUploads null case', async () => {
    try {
      await lighthouse.getUploads('null')
    } catch (error: any) {
      expect(typeof error.message).toBe('string')
    }
  }, 20000)
})
