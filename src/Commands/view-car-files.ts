import fs from 'fs'
import { resolve } from 'path'
import lighthouse from '../Lighthouse'
import { config } from './utils/getNetwork'
import { yellow, magenta, green, red } from 'kleur'

const showResponse = (uploadResponse: any) => {
  for (let i = 0; i < uploadResponse.length; i++) {
    if (uploadResponse[i]['fileStatus'] === 'Deleted') {
      continue
    }
    console.log(
      yellow(`File Name: ${uploadResponse[i]['fileName']}\r\n`) +
        Array(4).fill('\xa0').join('') +
        `pieceCid: ${uploadResponse[i]['pieceCid']}\r\n` +
        Array(4).fill('\xa0').join('') +
        `payloadCid: ${uploadResponse[i]['payloadCid']}\r\n` +
        Array(4).fill('\xa0').join('') +
        `fileStatus: ${uploadResponse[i]['fileStatus']}\r\n` +
        Array(4).fill('\xa0').join('') +
        `carSize: ${uploadResponse[i]['carSize']}\r\n` +
        Array(4).fill('\xa0').join('') +
        `fileSize: ${uploadResponse[i]['fileSize']}\r\n` +
        Array(4).fill('\xa0').join('') +
        `pieceSize: ${uploadResponse[i]['pieceSize']}\r\n` +
        Array(4).fill('\xa0').join('') +
        `Download URL: https://data-depot.lighthouse.storage/api/download/download_car?fileId=${uploadResponse[i]['id']}.car\r\n`
    )
  }
}

export default async function (_path: string, options: any) {
  if (!_path) {
    console.log(
      'lighthouse-web3 view-car-files\r\n\r\n' +
        green('Description: ') +
        'View car files with deal making data\r\n\r\n' +
        magenta('Example:') +
        Array(3).fill('\xa0').join('') +
        'lighthouse-web3 view-car-files\r\n'
    )
  } else {
    try {
      const apiKey = config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
      if (!apiKey) {
        throw new Error('Please create api-key first: use api-key command')
      }

      const authToken = (await lighthouse.dataDepotAuth(apiKey)).data
        .access_token

      const uploadResponse = (await lighthouse.viewCarFiles(1, authToken)).data
      showResponse(uploadResponse)
    } catch (error: any) {
      console.log(red(error.message))
      process.exit(0)
    }
  }
}
