import { ethers } from 'ethers'
import lighthouse from '..'

const signAuthMessage = async (publicKey: string, privateKey: string) => {
  const provider = new ethers.JsonRpcProvider()
  const signer = new ethers.Wallet(privateKey, provider)
  const messageRequested = (await lighthouse.getAuthMessage(signer.address))
    .data.message
  const signedMessage = await signer.signMessage(messageRequested)
  return signedMessage
}

describe('encryption', () => {
  describe('getAuthMessage', () => {
    it('should get auth message when valid public key is provided', async () => {
      const response = await lighthouse.getAuthMessage(
        '0x1Ec09D4B3Cb565b7CCe2eEAf71CC90c9b46c5c26'
      )
      expect(response.data.message).toMatch(
        /^Please sign this message to prove/
      )
    }, 60000)

    it('should not get auth message when invalid public key is provided', async () => {
      try {
        const response = await lighthouse.getAuthMessage('invalidPublicKey')
      } catch (error) {
        expect(error.message).toBe('Invalid public Key')
      }
    }, 60000)
  })
  describe('fetchEncryptionKey', () => {
    const publicKey = '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588'
    const privateKey =
      '0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a'
    const cid = 'QmVkHgHnYVUfvTXsaJisHRgc89zsrgVL6ATh9mSiegRYrX'

    it('should fetch encryption key when correct public-private key pair is provided', async () => {
      const signed_message = await signAuthMessage(privateKey)
      const response = await lighthouse.fetchEncryptionKey(
        cid,
        publicKey,
        signed_message
      )
      expect(typeof response.data.key).toBe('string')
    }, 60000)

    it('should not fetch encryption key when incorrect public-private key pair is provided', async () => {
      try {
        const randomPublicKey = '0x1ccEF158Dcbe6643F1cC577F236af79993F4D066'
        const signed_message = await signAuthMessage(privateKey)
        const response = await lighthouse.fetchEncryptionKey(
          cid,
          randomPublicKey,
          signed_message
        )
      } catch (error) {
        expect(typeof error.message).toBe('string')
      }
    }, 60000)

    it('should not fetch encryption key when incorrect CID is provided', async () => {
      try {
        const signed_message = await signAuthMessage(privateKey)
        const randomCID = 'QmaiauHSgTDMy2NtLbsygL3iKmLXBqHf39SBA1nAQFSSey'

        const response = await lighthouse.fetchEncryptionKey(
          randomCID,
          publicKey,
          signed_message
        )
      } catch (error) {
        expect(error).toBe('cid not found')
      }
    }, 60000)

    it('should not fetch encryption key when incorrect signature is provided', async () => {
      try {
        const signed_message =
          '0xd7f1e7ccf6e3620327d3b29c57018d076305148eec487c57d8121beac0067895'
        const response = await lighthouse.fetchEncryptionKey(
          cid,
          publicKey,
          signed_message
        )
      } catch (error) {
        expect(error.message).toBe('Invalid Signature')
      }
    }, 60000)
  })
  describe('shareFile', () => {
    const publicKey = '0x969e19A952A9aeF004e4F711eE481D72A59470B1'
    const privateKey =
      '0xa74ba0e4cc2e9f0be6776509cdb1495d76ac8fdc727a8b93f60772d73893fe2e'
    const cid = 'QmeYAMQLG7n4y2XNVwTexkzxNSzP4FQZyXdYM2U6cJhx8S'
    const shareTo = ['0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD']
    it('should share file access to the passed public address', async () => {
      const signed_message = await signAuthMessage(privateKey)
      const response = await lighthouse.shareFile(
        publicKey,
        shareTo,
        cid,
        signed_message
      )
      expect(response.data.cid).toEqual(cid)
      expect(response.data.shareTo).toEqual(shareTo)
      expect(response.data.status).toBe('Success')
    }, 60000)

    it('should deny access for sharing file uploaded by other account', async () => {
      try {
        const signed_message = await signAuthMessage(privateKey)
        const otherCid = 'QmVkHgHnYVUfvTXsaJisHRgc89zsrgVL6ATh9mSiegRYrX'
        const response = await lighthouse.shareFile(
          publicKey,
          ['0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD'],
          otherCid,
          signed_message
        )
      } catch (error) {
        expect(error.message).toEqual('Access Denied')
      }
    }, 60000)
  })
  describe('applyAccessCondition', () => {
    const publicKey = '0x969e19A952A9aeF004e4F711eE481D72A59470B1'
    const privateKey =
      '0xa74ba0e4cc2e9f0be6776509cdb1495d76ac8fdc727a8b93f60772d73893fe2e'
    const cid = 'QmeYAMQLG7n4y2XNVwTexkzxNSzP4FQZyXdYM2U6cJhx8S'
    // Conditions to add
    const conditions = [
      {
        id: 1,
        chain: 'FantomTest',
        method: 'balanceOf',
        standardContractType: 'ERC20',
        contractAddress: '0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1',
        returnValueTest: { comparator: '>=', value: '0' },
        parameters: [':userAddress'],
      },
      {
        id: 2,
        chain: 'FantomTest',
        method: 'balanceOf',
        standardContractType: 'ERC20',
        contractAddress: '0xF0Bc72fA04aea04d04b1fA80B359Adb566E1c8B1',
        returnValueTest: { comparator: '>=', value: '0' },
        parameters: [':userAddress'],
      },
    ]

    const aggregator = '([1] and [2])'

    it('should allow setting access condition for encrypt-uploaded file', async () => {
      const signedMessage = await signAuthMessage(privateKey)
      const response = await lighthouse.applyAccessCondition(
        publicKey,
        cid,
        signedMessage,
        conditions,
        aggregator
      )
      expect(response.data.status).toEqual('Success')
      expect(response.data.cid).toEqual(cid)
    }, 60000)
  })
  describe('revokeFileAccess', () => {
    it('should revoke file access to provided public address', async () => {
      const publicKey = '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588'
      const cid = 'QmVkHgHnYVUfvTXsaJisHRgc89zsrgVL6ATh9mSiegRYrX'
      const revokeTo = '0x969e19A952A9aeF004e4F711eE481D72A59470B1'
      const signedMessage = await signAuthMessage(
        '0x6aa0ee41fa9cf65f90c06e5db8fa2834399b59b37974b21f2e405955630d472a'
      )

      const response = await lighthouse.revokeFileAccess(
        publicKey,
        revokeTo,
        cid,
        signedMessage
      )
      expect(response.data.cid).toEqual(cid)
      expect(response.data.status).toEqual('Success')
      expect(response.data.revokeTo).toEqual(revokeTo)
    }, 20000)
  })
  describe('getAccessConditions', () => {
    it('should retrieve access conditions from provided cid', async () => {
      const cid = 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s'

      // Get File Encryption Key
      const response = await lighthouse.getAccessConditions(cid)
      expect(response.data).toHaveProperty('aggregator')
      expect(response.data).toHaveProperty('conditions')
      expect(response.data).toHaveProperty('sharedTo')
      expect(response.data.cid).toEqual(cid)
    }, 20000)
  })
})
