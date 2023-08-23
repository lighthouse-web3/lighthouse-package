import { green, yellow, white, red } from 'kleur'
import { ethers } from 'ethers'
import lighthouse from '../Lighthouse'
import readInput from './utils/readInput'
import { config } from './utils/getNetwork'
import { sign_auth_message } from './utils/auth'

export default async function (cid: string, address: string, _options: any) {
  if (!cid || !address) {
    console.log(
      '\r\nlighthouse-web3 share-file <cid> <address>\r\n' +
        green('Description: ') +
        'Share access to other user\r\n'
    )
  } else {
    try {
      if (!(config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY') as string)) {
        throw new Error('Please import wallet first!')
      }

      // Get key
      const options = {
        prompt: 'Enter your password: ',
        silent: true,
        default: '',
      }
      const password: any = await readInput(options)
      const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
        config.get('LIGHTHOUSE_GLOBAL_WALLET') as string,
        password?.trim()
      )

      const signedMessage = await sign_auth_message(decryptedWallet.privateKey)

      const shareResponse = await lighthouse.shareFile(
        decryptedWallet.address,
        [address],
        cid,
        signedMessage
      )

      console.log(
        yellow('sharedTo: ') +
          white(shareResponse.data.shareTo as string) +
          '\r\n' +
          yellow('cid: ') +
          white(shareResponse.data.cid)
      )
    } catch (error: any) {
      console.log(red(error.message))
      process.exit(0)
    }
  }
}
