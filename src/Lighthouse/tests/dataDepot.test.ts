import { resolve } from 'path'
import lighthouse from '..'
import 'dotenv/config'

describe('createCAR', () => {
  const apiKey = process.env.TEST_API_KEY as string
  let accessToken: string

  describe('dataDepotAuth', () => {
    it('should generate data depot auth token from valid API key', async () => {
      const authToken = (await lighthouse.dataDepotAuth(apiKey)).data
        .access_token
      expect(typeof authToken).toBe('string')
      accessToken = authToken
    }, 20000)

    it('should not generate data depot auth token from invalid API key', async () => {
      try {
        const invalidAPI = 'invalid.apiKey'
        const authToken = (await lighthouse.dataDepotAuth(invalidAPI)).data
          .access_token
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 403')
      }
    }, 20000)
  })

  describe('createCar', () => {
    const path = resolve(
      process.cwd(),
      'src/Lighthouse/tests/testImages/testImage1.svg'
    )
    it('should upload the CAR file when valid access token is provided', async () => {
      const uploadResponse = await lighthouse.createCar(path, accessToken)
      expect(uploadResponse.data).toEqual('Uploaded the files successfully')
    }, 20000)
    it('should not upload the CAR file when invalid access token is provided', async () => {
      try {
        const uploadResponse = await lighthouse.createCar(path, 'accessToken')
      } catch (error) {
        expect(error.message).toBe('Error: Request failed with status code 403')
      }
    }, 20000)
  })

  describe('viewCarFiles', () => {
    it('should retrieve the CAR files from valid access token', async () => {
      const response = await lighthouse.viewCarFiles(1, accessToken)
      expect(response.data.length).toBeGreaterThanOrEqual(1)
      expect(response.data[0]).toHaveProperty('pieceCid')
      expect(response.data[0]).toHaveProperty('carSize')
    }, 20000)

    it('should not retrieve the CAR files from invalid access token', async () => {
      try {
        const response = await lighthouse.viewCarFiles(1, 'invalidAccessToken')
      } catch (error) {
        expect(error.message).toBe('Error: Request failed with status code 403')
      }
    }, 20000)
  })
})
