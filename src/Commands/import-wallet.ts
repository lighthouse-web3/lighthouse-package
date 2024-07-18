import { cyan, green, red } from 'kleur'
import { ethers } from 'ethers'
import { config } from './utils/getNetwork'
import readInput from './utils/readInput'
import { lighthouseConfig } from '../lighthouse.config'

export default async function (data: any, options: any) {
  if (JSON.stringify(data) === '{}') {
    options.help()
  } else {
    try {
      const privateKey = data.privateKey
      const options = {
        prompt: 'Set a password for your wallet:',
        silent: true,
        default: '',
      }

      const password: any = await readInput(options)
      const wallet = new ethers.Wallet(privateKey)
      if (!wallet) {
        throw new Error('Importing Wallet Failed!')
      }
      const response = await fetch(
        lighthouseConfig.lighthouseAPI +
          `/api/auth/get_message?publicKey=${wallet.address}`
      )
      const _ = await response.json()
      const encryptedWallet = await wallet.encrypt(password.trim())

      config.set('LIGHTHOUSE_GLOBAL_WALLET', encryptedWallet)
      config.set('LIGHTHOUSE_GLOBAL_PUBLICKEY', wallet.address)

      console.log(
        cyan('Public Key: ' + wallet.address) + green('\r\nWallet Imported!')
      )
    } catch (error: any) {
      console.log(red(error.message))
      process.exit(0)
    }
  }
}
