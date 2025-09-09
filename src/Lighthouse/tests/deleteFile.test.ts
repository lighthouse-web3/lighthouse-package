import lighthouse from '..'
import 'dotenv/config'

describe('deleteFile', () => {
  const apiKey = process.env.TEST_API_KEY as string
  const fileId = process.env.TEST_FILE_ID as string

  it('should delete a file with correct API key and file ID', async () => {
    const uploadsRes = await lighthouse.getUploads(apiKey)
    const fileList = uploadsRes.data.fileList
    expect(fileList.length).toBeGreaterThan(0)

    const firstFileId = fileList[0].id
    expect(typeof firstFileId).toBe('string')

    const res = await lighthouse.deleteFile(apiKey, firstFileId)
    expect(res.data.message).toBe('File deleted successfully.')
  }, 60000)

  it('should not delete a file with invalid API key', async () => {
    try {
      await lighthouse.deleteFile('invalid.APIKey', fileId)
    } catch (error: any) {
      expect(error.message).toBe('Request failed with status code 401')
    }
  }, 60000)

  it('should not delete a file with invalid file ID', async () => {
    try {
      await lighthouse.deleteFile(apiKey, 'invalid-file-id')
    } catch (error: any) {
      // The error message may vary depending on API response
      expect(error.message).toMatch(/Request failed with status code/i)
    }
  }, 60000)
})
