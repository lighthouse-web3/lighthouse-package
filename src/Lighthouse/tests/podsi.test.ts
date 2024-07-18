import lighthouse from '..'

describe('podsi', () => {
  it('should get PoDSI when CID whose deal is created is provided', async () => {
    const response = (
      await lighthouse.posdi('QmaiauHSgTDMy2NtLbsygL3iKmLXBqHf39SBA1nAQFSSey')
    ).data

    expect(response).toHaveProperty('pieceCID')
    expect(typeof response.dealInfo[0].dealId).toBe('number')
    expect(response).toHaveProperty('dealInfo')
  }, 20000)

  it('should not get PoDSI when CID whose deal is not created is provided', async () => {
    try {
      const response = (
        await lighthouse.posdi('QmbnJh4KMARvXcSqNCaz3gv6KuJ8v19RYi55YVqPg4zZV8')
      ).data
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 404')
    }
  }, 20000)
})
