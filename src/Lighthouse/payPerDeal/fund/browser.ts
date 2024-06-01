/* istanbul ignore file */
import { ethers } from 'ethers'
import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js'
import erc20ABI from './abi/erc20'
import lighthouseEndowmentABI from './abi/lighthouseEndowment'
import crosschainABI from './abi/crosschain'
import { lighthouseConfig } from '../../../lighthouse.config'

export default async (amount: number, network: string, token: string) => {
  try {
    const config = lighthouseConfig[network]
    if (!config) {
      throw new Error('Unsupported Network!!!')
    }
    //@ts-ignore
    const provider = new ethers.BrowserProvider((window as any).ethereum)
    const feeData = await provider.getFeeData()
    const signer = await provider.getSigner()
    if (network == 'filecoin' || network == 'calibration') {
      const endowmentContract = new ethers.Contract(
        config.lighthouse_endowment_address,
        lighthouseEndowmentABI,
        signer
      )
      if (token.toLowerCase() === 'native') {
        // for pyth offchain price update data
        const connection = new EvmPriceServiceConnection(
          'https://hermes.pyth.network'
        )
        const priceIds = [
          '0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e',
        ]
        const offchainPriceUpdate = await connection.getPriceFeedsUpdateData(
          priceIds
        )

        const tx = await endowmentContract.depositFund(
          ethers.ZeroAddress,
          amount,
          true,
          offchainPriceUpdate,
          {
            value: amount,
            gasPrice: feeData.gasPrice,
          }
        )
        await tx.wait()
        return tx
      } else {
        const tokenAddress = config[`${token.toLowerCase()}_contract_address`]
        const erc20Contract = new ethers.Contract(
          tokenAddress,
          erc20ABI,
          signer
        )

        const approvalTx = await erc20Contract.approve(
          config.lighthouse_endowment_address,
          amount,
          {
            gasPrice: feeData.gasPrice,
          }
        )
        await approvalTx.wait()
        const tx = await endowmentContract.depositFund(
          tokenAddress,
          amount,
          true,
          [],
          {
            gasPrice: feeData.gasPrice,
          }
        )
        await tx.wait()
        return tx
      }
    } else {
      const depositContract = new ethers.Contract(
        config.crosschain_deposit_initializer,
        crosschainABI,
        signer
      )
      const tokenAddress = config[`${token.toLowerCase()}_contract_address`]
      const erc20Contract = new ethers.Contract(tokenAddress, erc20ABI, signer)

      const approvalTx = await erc20Contract.approve(
        config.crosschain_deposit_initializer,
        amount,
        {
          gasPrice: feeData.gasPrice,
        }
      )
      await approvalTx.wait()
      const encoder = ethers.AbiCoder.defaultAbiCoder()
      const payload = encoder.encode(
        ['address', 'address', 'uint256', 'bool'],
        [signer.getAddress(), tokenAddress, amount, true]
      )

      const tx = await depositContract.initiateCrossChainDeposit(
        tokenAddress,
        amount,
        'Filecoin',
        lighthouseConfig.filecoin,
        payload,
        {
          value: ethers.parseEther('1'), // Pass gas payment for FVM transaction
          gasPrice: feeData.gasPrice,
        }
      )
      await tx.wait()
      return tx
    }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
