import { yellow, red } from 'kleur'
import { config } from './utils/getNetwork'
import bytesToSize from './utils/byteToSize'
import lighthouse from '../Lighthouse'

export default async function () {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_API_KEY')) {
      throw new Error('Please create api-key first: use api-key command')
    }

    const response = (
      await lighthouse.getUploads(
        config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
      )
    ).data

    console.log(
      '\r\n' +
        Array(4).fill('\xa0').join('') +
        yellow('CID') +
        Array(47).fill('\xa0').join('') +
        yellow('File Name') +
        Array(5).fill('\xa0').join('') +
        yellow('File Size')
    )
    for (let i = 0; i < response.fileList.length; i++) {
      console.log(
        Array(4).fill('\xa0').join('') +
          response.fileList[i]['cid'] +
          Array(4).fill('\xa0').join('') +
          response.fileList[i]['fileName'].substring(0, 10) +
          Array(4).fill('\xa0').join('') +
          bytesToSize(parseInt(response.fileList[i]['fileSizeInBytes'])) +
          '\r\n'
      )
    }
  } catch (error: any) {
    console.log(red(error.message))
  }
}
