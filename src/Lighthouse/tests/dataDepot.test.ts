import axios from 'axios'
import { resolve } from 'path'
import { ethers } from 'ethers'
import lighthouse from '..'
import { lighthouseConfig } from '../../lighthouse.config'

describe('Data Depot', () => {
  test('Data Depot', async () => {
    const path = resolve(
      process.cwd(),
      'src/Lighthouse/tests/testImages/testImage1.svg'
    )
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
    const res = await lighthouse.getApiKey(publicKey, signedMessage)
    const authToken = (await lighthouse.dataDepotAuth(res.data.apiKey)).data.access_token
    const uploadResponse = await lighthouse.createCar(path, authToken)
    expect(typeof uploadResponse.data).toBe('string')
  }, 20000)
})
