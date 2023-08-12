import axios from 'axios'
import { ethers } from 'ethers'
import { lighthouseConfig } from '../../lighthouse.config'
import lighthouse from '..'

describe('Lighthouse Package', () => {
  let pubKey
  let privKey
  let apiKey

  describe('Create Wallet', () => {
    let password = 'Uchiha'
    // let password = 100001
    let wallet

    it('should not create a new wallet using non-string password', async () => {
      try {
        wallet = (await lighthouse.createWallet(100001)).data.encryptedWallet
        console.log('wallet created ')
      } catch (error) {
        console.log(error)
        expect(typeof error.message).toBe('string')
      }
    }, 20000)

    it('should create a new wallet using string password', async () => {
      wallet = (await lighthouse.createWallet(password)).data.encryptedWallet
      // console.log(wallet)
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
        expect(error.message).toEqual('invalid password')
      }
    }, 20000)

    it('should allow decripting wallet using correct password', async () => {
      const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
        wallet,
        password
      )
      const publicAddress = '0x' + JSON.parse(wallet).address
      pubKey = decryptedWallet.address
      privKey = decryptedWallet.privateKey
      expect(pubKey.toLowerCase()).toEqual(publicAddress)
    }, 20000)
  })

  describe('Generate API Key', () => {
    let verificationMessage

    it('should get verification message from server using public key', async () => {
      verificationMessage = await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/auth/get_message?publicKey=${pubKey}`
      )

      expect(verificationMessage.status).toEqual(200)
      expect(verificationMessage.data).toMatch(
        /^Please prove you are the owner/
      )
    })

    it('should not allow random private key to sign message and get API Key', async () => {
      try {
        const provider = ethers.getDefaultProvider()
        const signer = new ethers.Wallet(
          '0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b',
          provider
        )
        const signedMessage = await signer.signMessage(verificationMessage.data)
        const response = await lighthouse.getApiKey(pubKey, signedMessage)
      } catch (error) {
        expect(typeof error.message).toBe('string')
      }
    })

    it('should not generate api Key with random signed message', async () => {
      try {
        const provider = ethers.getDefaultProvider()
        const signer = new ethers.Wallet(
          '0x8218aa5dbf4dbec243142286b93e26af521b3e91219583595a06a7765abc9c8b',
          provider
        )
        const signedMessage = await signer.signMessage('randomMessage')
        const response = await lighthouse.getApiKey(pubKey, signedMessage)
      } catch (error) {
        console.log(error.message)
        expect(typeof error.message).toBe('string')
      }
    })

    it('should only allow corresponding private key to sign verification message and get API Key', async () => {
      try {
        const provider = ethers.getDefaultProvider()
        const signer = new ethers.Wallet(privKey, provider)
        const signedMessage = await signer.signMessage(verificationMessage.data)
        const response = await lighthouse.getApiKey(pubKey, signedMessage)
        expect(response.data).toHaveProperty('apiKey')
        apiKey = response.data.apiKey
      } catch (error) {
        console.log(error)
      }
    })
  })
})
