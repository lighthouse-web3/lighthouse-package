import { red } from 'kleur'
import fs from 'fs'
import { ethers } from 'ethers'
import axios from 'axios'
import lighthouse from '../Lighthouse'
import readInput from './utils/readInput'
import { lighthouseConfig } from '../lighthouse.config'
import { config } from './utils/getNetwork'
import { sign_auth_message } from './utils/auth'

export default async function (cid: string, dynamicData = {}) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')) {
      throw new Error('Please import wallet first!')
    }

    // get file details
    const fileDetails = (
      await axios.get(
        lighthouseConfig.lighthouseAPI + '/api/lighthouse/file_info?cid=' + cid
      )
    ).data
    if (!fileDetails) {
      throw new Error('Unable to get CID details.')
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
      password.trim()
    )

    const signedMessage = await sign_auth_message(decryptedWallet.privateKey)
    const fileEncryptionKey = await lighthouse.fetchEncryptionKey(
      cid,
      decryptedWallet.address,
      signedMessage,
      dynamicData
    )

    // Decrypt
    const decryptedFile = await lighthouse.decryptFile(
      cid,
      fileEncryptionKey.data.key ? fileEncryptionKey.data.key : ''
    )

    // save file
    fs.createWriteStream(fileDetails.fileName).write(Buffer.from(decryptedFile))
  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
}
