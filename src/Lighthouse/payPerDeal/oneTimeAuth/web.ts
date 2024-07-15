/* istanbul ignore file */
import { ethers } from 'ethers'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (): Promise<string> => {
  try {
    //@ts-ignore
    const provider = new ethers.BrowserProvider((window as any).ethereum)
    const signer = await provider.getSigner()
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
