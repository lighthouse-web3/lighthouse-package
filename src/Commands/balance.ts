import { yellow, red } from 'kleur'
import { ethers } from 'ethers'
import lighthouse from '../Lighthouse'
import byteToSize from './utils/byteToSize'
import { Spinner } from 'cli-spinner'
import { getNetwork, config } from './utils/getNetwork'
import { lighthouseConfig } from '../lighthouse.config'

export default async function (data: any, options: any) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')) {
      throw new Error('Wallet not created/imported')
    }
    const spinner = new Spinner('')
    spinner.start()

    const response = await lighthouse.getBalance(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    )

    spinner.stop()
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    console.log(
      yellow('\r\nData Limit: ') +
        Array(4).fill('\xa0').join('') +
        byteToSize(response.data.dataLimit) +
        yellow('\r\nData Used: ') +
        Array(5).fill('\xa0').join('') +
        byteToSize(response.data.dataUsed) +
        yellow('\r\nData Remaining: ') +
        byteToSize(response.data.dataLimit - response.data.dataUsed)
    )

    const network = getNetwork()

    if (
      network === 'polygon' ||
      network === 'fantom' ||
      network === 'binance' ||
      network === 'optimism'
    ) {
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
      ]

      const contractUSDT = new ethers.Contract(
        lighthouseConfig[network]['usdt_contract_address'],
        contractABI,
        provider
      )
      console.log(
        yellow('\r\nUSDT Balance: ') +
          Array(2).fill('\xa0').join('') +
          ethers.formatUnits(
            await contractUSDT.balanceOf(
              config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')
            ),
            lighthouseConfig[network]['usd_contract_decimal']
          )
      )

      const contractUSDC = new ethers.Contract(
        lighthouseConfig[network]['usdc_contract_address'],
        contractABI,
        provider
      )
      console.log(
        yellow('USDC Balance: ') +
          Array(2).fill('\xa0').join('') +
          ethers.formatUnits(
            await contractUSDC.balanceOf(
              config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')
            ),
            lighthouseConfig[network]['usd_contract_decimal']
          )
      )

      const contractDai = new ethers.Contract(
        lighthouseConfig[network]['dai_contract_address'],
        contractABI,
        provider
      )
      console.log(
        yellow('DAI Balance: ') +
          Array(3).fill('\xa0').join('') +
          ethers.formatUnits(
            await contractDai.balanceOf(
              config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')
            ),
            lighthouseConfig[network]['dai_contract_decimal']
          )
      )

      console.log(
        yellow(network) +
          ':' +
          Array(15 - network.length)
            .fill('\xa0')
            .join('') +
          ethers.formatEther(
            await provider.getBalance(
              config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY') as string
            )
          )
      )
    }
  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
}
