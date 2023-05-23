import {ethers} from 'ethers'
import axios from 'axios'
import lighthouse from '../../Lighthouse'
import { lighthouseConfig } from '../../lighthouse.config'

test('IPNS', async () => {
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

  //Generate key
  const key = (
    await lighthouse.generateKey(apiKey)
  ).data

  expect(typeof key.ipnsName).toBe('string')
  expect(typeof key.ipnsId).toBe('string')
  
  //List keys
  const keyList = (await lighthouse.getAllKeys(apiKey)).data
  expect(typeof keyList.length).toBe('number')
  
  //Publish record
  const publishRes = (await lighthouse.publishRecord(
    'Qmd5MBBScDUV3Ly8qahXtZFqyRRfYSmUwEcxpYcV4hzKfW',
    key.ipnsName,
    apiKey
  )).data
  expect(typeof publishRes.Name).toBe('string')
  
  //Remove Key
  const removeRes = await lighthouse.removeKey('00d31681ea3648edb059186ee6cb789a', apiKey)
  expect(typeof removeRes.data.Keys.length).toBe('number')
}, 40000)
