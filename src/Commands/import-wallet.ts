import axios from 'axios'
import chalk from 'kleur'
import { ethers } from 'ethers'
import { isPrivateKey } from '../Lighthouse/utils/util'
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
      const _ = await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/auth/get_message?publicKey=${wallet.address}`
      )
      const encryptedWallet = await wallet.encrypt(password.trim())

      config.set('LIGHTHOUSE_GLOBAL_WALLET', encryptedWallet)
      config.set('LIGHTHOUSE_GLOBAL_PUBLICKEY', wallet.address)

      console.log(
        chalk.cyan('Public Key: ' + wallet.address) +
          chalk.green('\r\nWallet Imported!')
      )
    } catch (error: any) {
      console.log(chalk.red(error.message))
    }
  }
}
