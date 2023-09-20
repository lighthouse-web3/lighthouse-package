import lighthouse from '..'
import 'dotenv/config'

describe('getUpload', () => {
  const apiKey = process.env.TEST_API_KEY as string
  const publicKey = process.env.TEST_PUBLIC_KEY

  it('should retrieve upload details with correct API key', async () => {
    const res = await lighthouse.getUploads(apiKey)

    expect(typeof res.data.fileList[0]['cid']).toBe('string')
    expect(res.data.fileList[0]['publicKey']).toBe(publicKey?.toLowerCase())
  }, 60000)

  it('should not retrieve upload details with invalid API key', async () => {
    try {
      const res = await lighthouse.getUploads('invalid.APIKey')
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 401')
    }
  }, 60000)
})
