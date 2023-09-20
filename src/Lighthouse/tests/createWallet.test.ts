import lighthouse from '..'
import { ethers } from 'ethers'

describe('createWallet', () => {
  let password = 'Uchiha'
  let wallet: any

  // this test case should execute the catch block
  it('should not create a new wallet using non-string password', async () => {
    try {
      wallet = (await lighthouse.createWallet('100001')).data.encryptedWallet
      console.log('wallet created ')
    } catch (error) {
      console.log(error)
      expect(typeof error.message).toBe('string')
    }
  }, 20000)

  it('should create a new wallet using string password', async () => {
    wallet = (await lighthouse.createWallet(password)).data.encryptedWallet
    console.log(wallet)
    const walletParse = JSON.parse(wallet)
    expect(walletParse).toHaveProperty('address')
  }, 20000)

  it('should not allow decripting wallet using incorrect password', async () => {
    try {
      const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
        wallet,
        'randomPassword'
      )
    } catch (error) {
      // console.log(error.message)
      expect(error.message).toEqual('incorrect password (argument=\"password\", value=\"[ REDACTED ]\", code=INVALID_ARGUMENT, version=6.7.1)')
    }
  }, 20000)

  it('should allow decripting wallet using correct password', async () => {
    const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
      wallet,
      password
    )
    const publicAddress = '0x' + JSON.parse(wallet).address
    console.log(decryptedWallet.address)
    console.log(decryptedWallet.privateKey)
    expect(decryptedWallet.address.toLowerCase()).toEqual(publicAddress)
  }, 20000)
})
