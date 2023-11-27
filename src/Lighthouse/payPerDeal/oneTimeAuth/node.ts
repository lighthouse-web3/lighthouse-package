/* istanbul ignore file */
import axios from 'axios'
import { ethers } from 'ethers'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (privateKey: string|undefined): Promise<string> => {
	try {
		if(!privateKey) {
			throw new Error("Private key not provided!!!")
		}
		const signer = new ethers.Wallet(privateKey)
		const message = (await axios.get(
			`${lighthouseConfig.lighthouseAPI}/api/auth/get_message?publicKey=${signer.address}`
		)).data
		const signature = await signer.signMessage(message)
		return `${signer.address}$${signature}`
	} catch (error: any) {
		throw new Error(error.message)
	}
}
