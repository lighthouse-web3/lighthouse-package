import { resolve } from 'path'
import lighthouse from '..'
import 'dotenv/config'

describe('getQuote', () => {
  const apiKey = process.env.TEST_API_KEY
  const publicKey = process.env.TEST_PUBLIC_KEY
  const filePath = resolve(
    process.cwd(),
    'src/Lighthouse/tests/testImages/testImage1.svg'
  )
  const folderPath = resolve(process.cwd(), 'src/Lighthouse/tests/testImages')

  it('should get quote for file when correct path and public key is provided', async () => {
    const response = (await lighthouse.getQuote(filePath, publicKey)).data
    expect(response).toHaveProperty('metaData')
    expect(response).toHaveProperty('dataLimit')
    expect(response).toHaveProperty('dataUsed')
  })

  it('should get quote for folder when correct path and public key is provided', async () => {
    const response = (await lighthouse.getQuote(folderPath, publicKey)).data
    expect(response).toHaveProperty('metaData')
    expect(response).toHaveProperty('dataLimit')
    expect(response).toHaveProperty('dataUsed')
  })

  it('should throw error when invalid public key is provided', async () => {
    try {
      const response = (await lighthouse.getQuote(filePath, 'invalidPublicKey'))
        .data
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 400')
    }
  })

  it('should throw error when wrong file/folder path is provided', async () => {
    try {
      const response = (await lighthouse.getQuote('wrong/file/path', publicKey))
        .data
    } catch (error) {
      expect(error.message).toMatch('ENOENT: no such file or directory')
    }
  })
})
