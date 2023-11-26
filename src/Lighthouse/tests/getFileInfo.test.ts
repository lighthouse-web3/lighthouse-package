import lighthouse from '..'

describe('getFileInfo', () => {
  it('should retrieve file information from CID', async () => {
    const fileName = 'testImage1.svg'
    const cid = 'QmaiauHSgTDMy2NtLbsygL3iKmLXBqHf39SBA1nAQFSSey'
    const fileInfo = (await lighthouse.getFileInfo(cid)).data

    expect(fileInfo).toHaveProperty('fileSizeInBytes')
    expect(fileInfo).toHaveProperty('cid')
    expect(fileInfo).toHaveProperty('encryption')
    expect(fileInfo).toHaveProperty('mimeType')
    expect(fileInfo.fileName).toBe(fileName)
  }, 20000)

  it('should not retrieve file information from invalid CID', async () => {
    try {
      const fileInfo = (await lighthouse.getFileInfo('invalidCID')).data
    } catch (error) {
      expect(error.message).toBe('Invalid CID')
    }
  }, 20000)
})
