/* istanbul ignore file */
import { ethers } from "ethers"
import erc20 from "./abi/erc20"
import lighthuseContract from "./abi/lighthouseContract"
import { lighthouseConfig } from "../../../lighthouse.config"

export default async (amount: number, network: string, token: string) => {
  try {
    const config = lighthouseConfig[network]
    if(!config) {
        throw new Error("Unsupported Network!!!")
    }
    const provider = new ethers.BrowserProvider((window as any).ethereum)
    const signer = await provider.getSigner()
    if(token.toLowerCase()==="native") {
        const tx = await signer.sendTransaction({
            to: config.lighthouse_contract_address,
            value: amount,
        })
        await tx.wait()
        return tx
    } else{
        const tokenAddress = config[`${token.toLowerCase()}_contract_address`]
        const paymentContract = new ethers.Contract(config.lighthouse_contract_address, lighthuseContract, signer)
        const erc20Contract = new ethers.Contract(tokenAddress, erc20, signer)
        const approvalTx = await erc20Contract.approve(config.lighthouse_contract_address, amount)
        await approvalTx.wait()
        const tx = await paymentContract.receiveToken(amount, tokenAddress)
        await tx.wait()
        return tx
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
