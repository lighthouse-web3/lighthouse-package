import { yellow, green, red } from 'kleur'
import { ethers } from 'ethers'
import lighthouse from '../Lighthouse'
import readInput from './utils/readInput'
import { config } from './utils/getNetwork'
import { lighthouseConfig } from '../lighthouse.config'

export default async (data: any, options: any) => {
  if (JSON.stringify(data) === '{}') {
    console.log(yellow('Select an option:'))
    options.help()
  } else {
    if (data.import) {
      config.set('LIGHTHOUSE_GLOBAL_API_KEY', data.import)
      console.log(green('\r\nApi Key imported!!'))
    } else {
      try {
        if (config.get('LIGHTHOUSE_GLOBAL_API_KEY') && !data.new) {
          console.log(
            yellow('\r\nApi Key: ') + config.get('LIGHTHOUSE_GLOBAL_API_KEY')
          )
        } else {
          if (!config.get('LIGHTHOUSE_GLOBAL_WALLET')) {
            throw new Error('Create/Import wallet first!!!')
          }

          const options = {
            prompt: 'Enter your password: ',
            silent: true,
            default: '',
          }

          const password: any = await readInput(options)
          const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
            config.get('LIGHTHOUSE_GLOBAL_WALLET') as string,
            password.trim()
          )

          const response = await fetch(
            lighthouseConfig.lighthouseAPI +
              `/api/auth/get_message?publicKey=${decryptedWallet.address}`
          )
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }
          const verificationMessage = (await response.json()) as string
          const signedMessage = await decryptedWallet.signMessage(
            verificationMessage
          )

          const keyResponse = await lighthouse.getApiKey(
            decryptedWallet.address,
            signedMessage
          )

          config.set('LIGHTHOUSE_GLOBAL_API_KEY', keyResponse.data.apiKey)
          console.log(yellow('\r\nApi Key: ') + keyResponse.data.apiKey)
        }
      } catch (error: any) {
        console.log(red(error.message))
        process.exit(0)
      }
    }
  }
}
