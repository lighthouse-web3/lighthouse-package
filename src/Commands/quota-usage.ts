import { yellow, red } from 'kleur'
import { Spinner } from 'cli-spinner'
import lighthouse from '../Lighthouse'
import byteToSize from './utils/byteToSize'
import { config } from './utils/getNetwork'

export default async function (data: any, options: any) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_API_KEY')) {
      throw new Error('API key not found. Please set up your API key first.')
    }

    const spinner = new Spinner('Fetching quota information... %s')
    spinner.start()

    const response = await lighthouse.getBalance(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    )

    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    const usagePercentage = (response.data.dataUsed / response.data.dataLimit) * 100

    console.log('\nQuota Usage:')
    console.log(yellow('Total Quota: ') + byteToSize(response.data.dataLimit))
    console.log(yellow('Used Quota: ') + byteToSize(response.data.dataUsed))
    console.log(yellow('Remaining: ') + byteToSize(response.data.dataLimit - response.data.dataUsed))
    
    const barWidth = 30
    const filledWidth = Math.round((usagePercentage / 100) * barWidth)
    const bar = '█'.repeat(filledWidth) + '░'.repeat(barWidth - filledWidth)
    
    console.log(yellow('\nUsage Progress:'))
    console.log(`${bar} ${usagePercentage.toFixed(2)}%`)

  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
} 