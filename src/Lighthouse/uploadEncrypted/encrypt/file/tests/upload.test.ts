import uploadFile from '../node'
import axios from 'axios'
import { getJWT } from '@lighthouse-web3/kavach'
import 'dotenv/config'
import { signAuthMessage } from '../../../../tests/uploadEncrypted.test'
import { ethers } from 'ethers'
import lighthouse from '../../../../index'
import { lighthouseConfig } from '../../../../../lighthouse.config'

jest.setTimeout(60000)

describe('uploadTest', () => {
  test('test multiple ', async () => {
    const provider = ethers.getDefaultProvider()
    const signer = new ethers.Wallet(
      '0x8488d2c632da07a93647d7cf701ab6728a884467b1595f3c94007977a20b3539',
      provider
    )
    const verificationMessage = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/auth/get_message?publicKey=${signer.address.toLowerCase()}`
      )
    ).data
    const signedMessage = await signer.signMessage(verificationMessage)
    const apiKey = await lighthouse.getApiKey(
      signer.address.toLowerCase(),
      signedMessage
    )

    const signedMessageEncryption = await signAuthMessage(
      '0x8488d2c632da07a93647d7cf701ab6728a884467b1595f3c94007977a20b3539'
    )
    const { JWT, error } = await getJWT(
      signer.address.toLowerCase(),
      signedMessageEncryption
    )
    if (error) {
      throw new Error(error.toString())
    }
    const data = await uploadFile(
      './src/Lighthouse/uploadEncrypted/encrypt',
      apiKey.data.apiKey,
      signer.address.toLowerCase(),
      JWT ?? ''
    )
    expect(typeof data).toBe(typeof [])
  })
})
