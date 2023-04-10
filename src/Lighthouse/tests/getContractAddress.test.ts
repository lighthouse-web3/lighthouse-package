import lighthouse from '../../Lighthouse'

describe('getContractAddress', () => {
  test('getContractAddress Main Case', async () => {
    const contractAddress = await lighthouse.getContractAddress('polygon')

    expect(typeof contractAddress.data).toBe('string')
  }, 2000)
})
