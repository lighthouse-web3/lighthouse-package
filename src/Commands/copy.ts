import { yellow, red } from 'kleur'
import { Spinner } from 'cli-spinner'
import lighthouse from '../Lighthouse'
import { config } from './utils/getNetwork'
import path from 'path'
import fs from 'fs-extra'

export default async function (cid: string, newLocation: string, options: any) {
  const spinner = new Spinner('Copying file... %s')
  
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

    spinner.start()

    const uploadsResponse = await lighthouse.getUploads(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    )

    const file = uploadsResponse.data.fileList.find((f: any) => f.cid === cid)
    if (!file) {
      throw new Error('File not found with the given CID')
    }

    const destDir = path.dirname(newLocation)
    await fs.ensureDir(destDir)

    const response = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`)
    if (!response.ok) {
      throw new Error('Failed to download file from IPFS')
    }

    const buffer = await response.arrayBuffer()
    await fs.writeFile(newLocation, new Uint8Array(buffer))

    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    console.log(yellow('\nFile copied successfully:'))
    console.log('From CID:', cid)
    console.log('To:', newLocation)

  } catch (error: any) {
    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)
    console.log(red(error.message))
    process.exit(0)
  }
} 