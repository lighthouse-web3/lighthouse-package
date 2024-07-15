/* istanbul ignore file */
import { ethers } from 'ethers'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (privateKey: string | undefined): Promise<string> => {
  try {
    if (!privateKey) {
      throw new Error('Private key not provided!!!')
    }
    const signer = new ethers.Wallet(privateKey)
    // Replace axios call with fetch
    const response = await fetch(
      `${lighthouseConfig.lighthouseAPI}/api/auth/get_message?publicKey=${signer.address}`
    )
    const message = (await response.json()) as string
    const signature = await signer.signMessage(message)
    return `${signer.address}$${signature}`
  } catch (error: any) {
    throw new Error(error.message)
  }
}
