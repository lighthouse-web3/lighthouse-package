import { ethers } from 'ethers'
import axios from 'axios'
import lighthouse from '../../Lighthouse'
import { lighthouseConfig } from '../../lighthouse.config'
import 'dotenv/config'

describe('ipns', () => {
  const apiKey = process.env.TEST_API_KEY as string
  let ipnsName: string
  describe('generateKey', () => {
    it('should generate Key using valid apiKey', async () => {
      const key = (await lighthouse.generateKey(apiKey)).data
      expect(key).toHaveProperty('ipnsName')
      expect(key).toHaveProperty('ipnsId')
      ipnsName = key.ipnsName
    }, 20000)

    it('should not generate Key using invalid apiKey', async () => {
      try {
        const key = (await lighthouse.generateKey('invalidApiKey')).data
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 401')
      }
    }, 20000)
  })

  describe('publishRecord', () => {
    const cid = 'Qmd5MBBScDUV3Ly8qahXtZFqyRRfYSmUwEcxpYcV4hzKfW'
    it('should publish data using correct ipnsName', async () => {
      const publishRes = (await lighthouse.publishRecord(cid, ipnsName, apiKey))
        .data
      expect(publishRes).toHaveProperty('Name')
      expect(publishRes).toHaveProperty('Value')
      expect(publishRes.Value).toEqual(`/ipfs/${cid}`)
    }, 20000)

    it('should not publish data using incorrect ipnsName', async () => {
      try {
        const publishRes = (
          await lighthouse.publishRecord(cid, 'invalid ipnsName', apiKey)
        ).data
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400')
      }
    }, 20000)
  })

  describe('getAllKeys', () => {
    it('should retrieve list of all keys from apiKey', async () => {
      const keyList = (await lighthouse.getAllKeys(apiKey)).data
      const len = keyList.length
      expect(typeof keyList[len - 1].ipnsName).toBe('string')
    }, 20000)
  })

  describe('removeKey', () => {
    it('should remove key from key list', async () => {
      const lenBefore = (await lighthouse.getAllKeys(apiKey)).data.length
      const response = (await lighthouse.removeKey(ipnsName, apiKey)).data
      const lenAfter = (await lighthouse.getAllKeys(apiKey)).data.length
      expect(response.Keys[0].Name).toBe(ipnsName)
      expect(lenBefore - lenAfter).toEqual(1)
    }, 20000)

    it('should throw error when removing non existent/already removed key', async () => {
      try {
        const response = (await lighthouse.removeKey(ipnsName, apiKey)).data
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400')
      }
    })
  })
})
