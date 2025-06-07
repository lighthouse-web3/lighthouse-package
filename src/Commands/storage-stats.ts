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

    const spinner = new Spinner('Fetching storage statistics... %s')
    spinner.start()

    const balanceResponse = await lighthouse.getBalance(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    )

    const uploadsResponse = await lighthouse.getUploads(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    )

    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    const totalFiles = uploadsResponse.data.totalFiles
    const totalSize = uploadsResponse.data.fileList.reduce((acc: number, file: any) => acc + file.size, 0)
    const averageFileSize = totalFiles > 0 ? totalSize / totalFiles : 0

    console.log('\nStorage Statistics:')
    console.log(yellow('Total Storage Limit: ') + byteToSize(balanceResponse.data.dataLimit))
    console.log(yellow('Total Storage Used: ') + byteToSize(balanceResponse.data.dataUsed))
    console.log(yellow('Storage Remaining: ') + byteToSize(balanceResponse.data.dataLimit - balanceResponse.data.dataUsed))
    console.log(yellow('Storage Usage %: ') + ((balanceResponse.data.dataUsed / balanceResponse.data.dataLimit) * 100).toFixed(2) + '%')
    console.log(yellow('Total Files: ') + totalFiles)
    console.log(yellow('Average File Size: ') + byteToSize(averageFileSize))

  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
} 