import fs from 'fs-extra'
import path from 'path'
import { yellow, red } from 'kleur'
import { Spinner } from 'cli-spinner'
import lighthouse from '../Lighthouse'
import { config } from './utils/getNetwork'

export default async function (cid: string, newLocation: string, options: any) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_API_KEY')) {
      throw new Error('API key not found. Please set up your API key first.')
    }

    if (!cid) {
      throw new Error('Please provide a CID')
    }

    if (!newLocation) {
      throw new Error('Please provide a new location')
    }

    const spinner = new Spinner('Moving file... %s')
    spinner.start()

    const fileInfo = await lighthouse.getFileInfo(cid)
    console.log(yellow('\nFile Information:'))
    console.log('CID:', cid)
    console.log('Original Name:', fileInfo.data.fileName)
    console.log('New Name:', newLocation)

    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    console.log(yellow('\nFile moved successfully:'))
    console.log('From:', fileInfo.data.fileName)
    console.log('To:', newLocation)
    console.log('New CID:', cid)

  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
} 