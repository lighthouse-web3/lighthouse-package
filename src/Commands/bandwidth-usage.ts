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

    const spinner = new Spinner('Fetching bandwidth usage... %s')
    spinner.start()

    const uploadsResponse = await lighthouse.getUploads(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    )

    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    const totalDownloads = uploadsResponse.data.fileList.reduce((acc: number, file: any) => acc + (file.downloadCount || 0), 0)
    const totalBandwidth = uploadsResponse.data.fileList.reduce((acc: number, file: any) => 
      acc + (file.size * (file.downloadCount || 0)), 0)

    console.log('\nBandwidth Usage Statistics:')
    console.log(yellow('Total Downloads: ') + totalDownloads)
    console.log(yellow('Total Bandwidth Used: ') + byteToSize(totalBandwidth))
    console.log(yellow('Average Bandwidth per Download: ') + 
      byteToSize(totalDownloads > 0 ? totalBandwidth / totalDownloads : 0))

  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
} 