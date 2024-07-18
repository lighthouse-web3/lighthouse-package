import lighthouse from '..'
import 'dotenv/config'

describe('uploadBuffer', () => {
  const apiKey = process.env.TEST_API_KEY as string
  const image =
    'iVBORw0KGgoAAAANSUhEUgAAAA8AAAAMCAYAAAC9QufkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADCSURBVChTrZJRCoMwDIaTtM56hsEeRNjDELz/yeas7ZLYMBWEOfZBiH+axKSK7bXNcJKcpSQDpZTgrEmx1NPS6zf+VIwsCAHZ9khczJAcjRUNiAjOu02SQY70zJAc0djdukxYenCdXEaak0rnSoH1s+9SNPb3PnvvYY4zxBiXaKEOtfrxOaqvLhW/lWB6TXrrJOMq7OTZTJKMdXyjh8eQ2em4dvgtvPqn2yEH/yD51S0KMm7TBKjrZV9l1/fCu4cmwBsXPlBp+IIIrQAAAABJRU5ErkJggg=='

  it('should upload buffer to ipfs when valid API key provided', async () => {
    const deployResponse = (await lighthouse.uploadBuffer(image, apiKey)).data

    expect(deployResponse).toHaveProperty('Name')
    expect(typeof deployResponse['Name']).toBe('string')

    expect(deployResponse).toHaveProperty('Hash')
    expect(typeof deployResponse['Hash']).toBe('string')

    expect(deployResponse).toHaveProperty('Size')
    expect(typeof deployResponse['Size']).toBe('string')
  }, 60000)

  it('should not upload buffer to ipfs when invalid API key provided', async () => {
    try {
      const deployResponse = (
        await lighthouse.uploadBuffer(image, 'invalid.apiKey')
      ).data
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 500')
    }
  }, 60000)
})
