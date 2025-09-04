import { yellow, red, green } from 'kleur'
import { config } from './utils/getNetwork'
import lighthouse from '../Lighthouse'

export default async function (fileId: string) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_API_KEY')) {
      throw new Error('Please create api-key first: use api-key command')
    }

    if (!fileId) {
      throw new Error('Please provide a file ID to delete.')
    }

    const response = await lighthouse.deleteFile(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string,
      fileId
    )

    console.log(green('Success: ') + yellow(response.data.message))
  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
}
