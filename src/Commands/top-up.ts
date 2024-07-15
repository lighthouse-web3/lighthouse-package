import chalk from 'kleur'
import { ethers } from 'ethers'
import { Spinner } from 'cli-spinner'
import lighthouse from '../Lighthouse'
import { getNetwork, config } from './utils/getNetwork'
import readInput from './utils/readInput'

import { lighthouseConfig } from '../lighthouse.config'

export default async function (_amount: number) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')) {
      throw new Error('Wallet not created/imported')
    }
    let spinner = new Spinner('')
    spinner.start()

    const balance = await lighthouse.getBalance(
      config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY') as string
    )

    spinner.stop()
    process.stdout.clearLine(-1)
    process.stdout.cursorTo(0)

    if (!balance) {
      throw new Error('Error fetching balance!')
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

    if (!decryptedWallet) {
      throw new Error('Incorrect password!')
    }

    const network = getNetwork()

    if (network === 'polygon-testnet') {
      const provider = new ethers.JsonRpcProvider(
        lighthouseConfig[network]['rpc']
      )

      const contractABI = [
        {
          constant: true,
          inputs: [{ name: 'account', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [],
          name: 'decimals',
          outputs: [
            {
              internalType: 'uint8',
              name: '',
              type: 'uint8',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'spender',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
          ],
          name: 'approve',
          outputs: [
            {
              internalType: 'bool',
              name: '',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ]

      const contractDepositABI = [
        {
          inputs: [
            {
              internalType: 'address',
              name: '_tokenAddress',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
            },
          ],
          name: 'addDeposit',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_address',
              type: 'address',
            },
          ],
          name: 'getAvailableSpace',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ]

      const contractUSDC = new ethers.Contract(
        lighthouseConfig[network]['usdc_contract_address'],
        contractABI,
        new ethers.Wallet(decryptedWallet.privateKey, provider)
      )
      const contractDeposit = new ethers.Contract(
        lighthouseConfig[network]['deposit_contract_address'],
        contractDepositABI,
        new ethers.Wallet(decryptedWallet.privateKey, provider)
      )
      console.log(
        chalk.yellow('USDC Balance: ') +
          Array(2).fill('\xa0').join('') +
          ethers.formatUnits(
            await contractUSDC.balanceOf(
              config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')
            ),
            lighthouseConfig[network]['usd_contract_decimal']
          )
      )
      console.log(
        chalk.yellow('Current contract Storage Balance: ') +
          (
            (await contractDeposit.getAvailableSpace(
              config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')
            )) / lighthouseConfig.gbInBytes
          ).toFixed(2) +
          'GB'
      )

      const amount = ethers
        .parseUnits(String(_amount), await contractUSDC.decimals())
        .toString()

      spinner = new Spinner(`Getting Approval to spent $${String(_amount)}`)
      spinner.start()

      let tx = await contractUSDC.approve(
        lighthouseConfig[network]['deposit_contract_address'],
        amount
      )
      tx = await tx.wait()
      spinner.stop()

      spinner = new Spinner(`Request top-up for  $${String(_amount)}`)
      spinner.start()
      tx = await contractDeposit.addDeposit(
        lighthouseConfig[network]['usdc_contract_address'],
        amount,
        {
          gasLimit: 500000,
        }
      )

      tx = await tx.wait()
      spinner.stop()

      console.log(
        '\n' +
          chalk.green('successful: ') +
          lighthouseConfig[network].scan +
          tx.transactionHash
      )
    } else {
      console.log(
        chalk.yellow(network) + ': Network not Supported yet for top up'
      )
    }
  } catch (error: any) {
    console.log(chalk.red(error.message))
    process.exit(0)
  }
}
