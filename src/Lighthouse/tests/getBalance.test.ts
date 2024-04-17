import lighthouse from '../../Lighthouse'
import 'dotenv/config'

describe('getBalance', () => {
  it('should retrieve balance when lighthouse-package generated public key provided', async () => {
    const apiKey = process.env.TEST_API_KEY as string
    const balance = (await lighthouse.getBalance(apiKey)).data

    expect(typeof balance.dataLimit).toBe('number')
    expect(typeof balance.dataUsed).toBe('number')
    expect(balance.dataLimit).toBeGreaterThanOrEqual(balance.dataUsed)
  }, 20000)

  it('should throw error when random public key is provided', async () => {
    try {
      const randomAPIKey = '0xD794EC627684D6Be2667413e8FF1DeDc0eef363f'
      const balance = (await lighthouse.getBalance(randomAPIKey)).data
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 401')
    }
  }, 20000)

  it('should throw error when invalid public key is provided', async () => {
    try {
      const invalidAPIKey = 'invalidPublicKey'
      const balance = (await lighthouse.getBalance(invalidAPIKey)).data
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 401')
    }
  }, 20000)
})
