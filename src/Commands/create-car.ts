import fs from 'fs'
import { resolve } from 'path'
import lighthouse from '../Lighthouse'
import { config } from './utils/getNetwork'
import { cyan, magenta, green, red } from 'kleur'

export default async function (_path: string, options: any) {
  if (!_path) {
    console.log(
      'lighthouse-web3 create-car <path>\r\n\r\n' +
        green('Description: ') +
        'Create car for deal making\r\n\r\n' +
        cyan('Options:\r\n') +
        Array(3).fill('\xa0').join('') +
        '--path: Required, path to file\r\n\r\n' +
        magenta('Example:') +
        Array(3).fill('\xa0').join('') +
        'lighthouse-web3 create-car /home/cosmos/Desktop/ILoveAnime.jpg\r\n'
    )
  } else {
    try {
      const path = resolve(process.cwd(), _path)
      if(fs.lstatSync(path).isDirectory()){
        throw new Error('Directory is not supported')
      } else{
        const apiKey = config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
        if (!apiKey) {
          throw new Error('Please create api-key first: use api-key command')
        }

        const authToken = (await lighthouse.dataDepotAuth(apiKey)).data.access_token
        const uploadResponse = await lighthouse.createCar(path, authToken)
        console.log(green('File uploaded successfully!!!'))
      }
    } catch (error: any) {
      console.log(red(error.message))
    }
  }
}
