import lighthouse from '..'

describe('getUpload', () => {
  test('getUploads', async () => {
    const response = await lighthouse.getUploads(
      '0x487fc2fE07c593EAb555729c3DD6dF85020B5160'
    )

    expect(typeof response.data.fileList[0]['cid']).toBe('string')
  }, 20000)

  test('getUploads null case', async () => {
    try {
      await lighthouse.getUploads('null')
    } catch (error: any) {
      expect(typeof error.message).toBe('string')
    }
  }, 20000)
})
