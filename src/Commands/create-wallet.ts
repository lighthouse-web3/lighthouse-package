import { cyan, green, red } from 'kleur'
import { ethers } from 'ethers'
import fs from 'fs'
import lighthouse from '../Lighthouse'
import readInput from './utils/readInput'
import { config } from './utils/getNetwork'

export default async (_: any, _options: any) => {
  try {
    const options = {
      prompt: 'Set a password for your wallet:',
      silent: true,
      timeout: 30000,
    }

    const password: any = await readInput(options)

    const encryptedWallet = (await lighthouse.createWallet(password.trim()))
      .data.encryptedWallet
    const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedWallet,
      password.trim()
    )

    const publicKey = decryptedWallet.address
    const privateKey = decryptedWallet.privateKey

    if (!encryptedWallet) {
      throw new Error('Creating Wallet Failed!')
    }
    const saveWallet = {
      publicKey: publicKey,
      privateKey: privateKey,
    }

    fs.writeFile('wallet.json', JSON.stringify(saveWallet, null, 4), (err) => {
      if (err) {
        throw new Error('Saving Wallet Failed!')
      } else {
        config.set('LIGHTHOUSE_GLOBAL_WALLET', encryptedWallet)
        config.set('LIGHTHOUSE_GLOBAL_PUBLICKEY', publicKey)
        console.log(
          cyan('Public Key: ' + publicKey) + green('\r\nWallet Created!')
        )
      }
    })
  } catch (error: any) {
    console.log(red(error.message))
  }
}
