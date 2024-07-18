/* istanbul ignore file */
import { ethers } from 'ethers'
import erc20 from './abi/erc20'
import lighthuseContract from './abi/lighthouseContract'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (
  amount: number,
  network: string,
  token: string,
  privateKey: string | undefined
) => {
  try {
    if (!privateKey) {
      throw new Error('Private Key not found!!!')
    }
    const config = lighthouseConfig[network]
    if (!config) {
      throw new Error('Unsupported Network!!!')
    }
    const provider = new ethers.JsonRpcProvider(config.rpc)
    const getFeeData = await provider.getFeeData()
    const signer = new ethers.Wallet(privateKey, provider)
    if (token.toLowerCase() === 'native') {
      const gasEstimate = await signer.estimateGas({
        to: config.lighthouse_contract_address,
        value: amount,
      })
      const tx = await signer.sendTransaction({
        to: config.lighthouse_contract_address,
        value: amount,
        gasLimit: gasEstimate,
        gasPrice: getFeeData.gasPrice,
      })
      await tx.wait()
      return tx
    } else {
      const tokenAddress = config[`${token.toLowerCase()}_contract_address`]
      const paymentContract = new ethers.Contract(
        config.lighthouse_contract_address,
        lighthuseContract,
        signer
      )
      const erc20Contract = new ethers.Contract(tokenAddress, erc20, signer)
      const approvalData = erc20Contract.interface.encodeFunctionData(
        'approve',
        [config.lighthouse_contract_address, amount]
      )
      const approvalTxObject = {
        to: tokenAddress,
        data: approvalData,
      }
      const gasEstimateForApproval = await signer.estimateGas(approvalTxObject)
      const approvalTx = await erc20Contract.approve(
        config.lighthouse_contract_address,
        amount,
        {
          gasLimit: gasEstimateForApproval,
          gasPrice: getFeeData.gasPrice,
        }
      )
      await approvalTx.wait()
      const transferData = paymentContract.interface.encodeFunctionData(
        'receiveToken',
        [amount, tokenAddress]
      )
      const transferTxObject = {
        to: config.lighthouse_contract_address,
        data: transferData,
      }
      const gasEstimateForTransfer = await signer.estimateGas(transferTxObject)
      const tx = await paymentContract.receiveToken(amount, tokenAddress, {
        gasLimit: gasEstimateForTransfer,
        gasPrice: getFeeData.gasPrice,
      })
      await tx.wait()
      return tx
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
