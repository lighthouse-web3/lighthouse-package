import lighthouse from '..'
import 'dotenv/config'

describe('uploadText', () => {
  const apiKey = process.env.TEST_API_KEY
  const text =
    'Lorem ipsum dolor sit amet, consectetur adip eu fugiat null a ante et dolore magna aliq'

  it('should upload text to ipfs when valid API key provided', async () => {
    const deployResponse = (await lighthouse.uploadText(text, apiKey, 'sample'))
      .data

    expect(deployResponse['Name']).toEqual('sample')

    expect(deployResponse).toHaveProperty('Name')
    expect(typeof deployResponse['Name']).toBe('string')

    expect(deployResponse).toHaveProperty('Hash')
    expect(typeof deployResponse['Hash']).toBe('string')

    expect(deployResponse).toHaveProperty('Size')
    expect(typeof deployResponse['Size']).toBe('string')
  }, 60000)

  it('should not upload text to ipfs when invalid API key provided', async () => {
    try {
      const deployResponse = (
        await lighthouse.uploadText(text, 'invalid.apiKey', 'sample')
      ).data
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 500')
    }
  }, 60000)
})
