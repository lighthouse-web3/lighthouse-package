import { green, yellow, red, cyan } from 'kleur'
import { config } from './utils/getNetwork'
import bytesToSize from './utils/byteToSize'
import lighthouse from '../Lighthouse'
import { lighthouseConfig } from '../lighthouse.config'

export default async function () {
  try {
    const apiKey = config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    if (!apiKey) {
      throw new Error(
        'Please create an API key first using the "api-key" command.'
      )
    }

    const balance = (await lighthouse.getBalance(apiKey)).data

    const uploads = (await lighthouse.getUploads(apiKey)).data
    const numberOfFiles = uploads.fileList.length
    const totalSizeInBytes = uploads.fileList.reduce(
      (acc, file) => acc + parseInt(file.fileSizeInBytes),
      0
    )
    const totalSize = bytesToSize(totalSizeInBytes)

    console.log(cyan('\r\nLighthouse Account Stats'))
    console.log('------------------------')
    console.log(
      `${yellow('Account Balance:')}\t${green(bytesToSize(balance.dataLimit))}`
    )
    console.log(`${yellow('Total Files:')}\t\t${green(numberOfFiles)}`)
    console.log(`${yellow('Total Storage Used:')}\t${green(totalSize)}`)
  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
}
