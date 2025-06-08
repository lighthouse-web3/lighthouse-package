import { yellow, red } from 'kleur'
import { Spinner } from 'cli-spinner'
import lighthouse from '../Lighthouse'
import byteToSize from './utils/byteToSize'
import { config } from './utils/getNetwork'

interface FilterOptions {
  type?: string;
  size?: string;
  date?: string;
}

export default async function (options: FilterOptions) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_API_KEY')) {
      throw new Error('API key not found. Please set up your API key first.')
    }

    const spinner = new Spinner('Fetching files... %s')
    spinner.start()

    const response = await lighthouse.getUploads(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    )

    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    let files = response.data.fileList

    if (options.type) {
      files = files.filter((f: any) => f.mimeType?.includes(options.type))
    }

    if (options.size) {
      const [operator, size] = options.size.split(':')
      const sizeInBytes = parseInt(size)
      files = files.filter((f: any) => {
        const fileSize = parseInt(f.fileSizeInBytes)
        switch(operator) {
          case 'gt': return fileSize > sizeInBytes
          case 'lt': return fileSize < sizeInBytes
          case 'eq': return fileSize === sizeInBytes
          default: return true
        }
      })
    }

    if (options.date) {
      const date = new Date(options.date)
      files = files.filter((f: any) => new Date(f.uploadTime) >= date)
    }

    console.log(yellow('\nFiles:'))
    files.forEach((file: any) => {
      let uploadTime = 'Not available';
      try {
        if (file.createdAt) {
          const timestamp = typeof file.createdAt === 'string' 
            ? parseInt(file.createdAt) 
            : file.createdAt;
          uploadTime = new Date(timestamp).toLocaleString();
        }
      } catch (e) {
        uploadTime = 'Not available';
      }

      console.log('\nCID:', file.cid || 'Not available')
      console.log('Name:', file.fileName || 'Not available')
      console.log('Size:', file.fileSizeInBytes ? byteToSize(parseInt(file.fileSizeInBytes.toString())) : '0 Bytes')
      console.log('Type:', file.mimeType || 'Not available')
      console.log('Upload Time:', uploadTime)
    })

  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
} 