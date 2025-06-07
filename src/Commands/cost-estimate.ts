import { yellow, red } from 'kleur'
import { Spinner } from 'cli-spinner'
import byteToSize from './utils/byteToSize'

export default async function (size: string, options: any) {
  try {
    if (!size) {
      throw new Error('Please provide a file size (e.g., 1GB, 500MB, 1TB)')
    }

    const spinner = new Spinner('Calculating cost estimate... %s')
    spinner.start()

    const sizeInBytes = parseSizeToBytes(size)
    
    const storageRatePerGBPerMonth = 0.1 
    const bandwidthRatePerGB = 0.05 
    
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024)
    const monthlyStorageCost = sizeInGB * storageRatePerGBPerMonth
    const estimatedBandwidthCost = sizeInGB * bandwidthRatePerGB

    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    console.log('\nCost Estimate for ' + yellow(size) + ' (' + byteToSize(sizeInBytes) + '):')
    console.log(yellow('Monthly Storage Cost: ') + `$${monthlyStorageCost.toFixed(2)} USD`)
    console.log(yellow('Estimated Bandwidth Cost: ') + `$${estimatedBandwidthCost.toFixed(2)} USD per full download`)
    console.log(yellow('Total First Month Estimate: ') + `$${(monthlyStorageCost + estimatedBandwidthCost).toFixed(2)} USD`)

  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
}

function parseSizeToBytes(sizeString: string): number {
  const units: { [key: string]: number } = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  }

  const match = sizeString.match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i)
  if (!match) {
    throw new Error('Invalid size format. Please use format like 1GB, 500MB, 1TB')
  }

  const size = parseFloat(match[1])
  const unit = match[2].toUpperCase()

  if (!units[unit]) {
    throw new Error('Invalid unit. Use B, KB, MB, GB, or TB')
  }

  return size * units[unit]
} 