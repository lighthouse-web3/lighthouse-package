import { yellow, red } from 'kleur'
import { Spinner } from 'cli-spinner'
import lighthouse from '../Lighthouse'
import byteToSize from './utils/byteToSize'
import { config } from './utils/getNetwork'

export default async function (query: string, options: any) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_API_KEY')) {
      throw new Error('API key not found. Please set up your API key first.')
    }

    if (!query) {
      throw new Error('Please provide a search query')
    }

    const spinner = new Spinner('Searching files... %s')
    spinner.start()

    const response = await lighthouse.getUploads(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    )

    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    const searchQuery = query.toLowerCase()
    const files = response.data.fileList.filter((file: any) => 
      file.fileName.toLowerCase().includes(searchQuery) ||
      file.cid.toLowerCase().includes(searchQuery) ||
      file.mimeType?.toLowerCase().includes(searchQuery)
    )

    if (files.length === 0) {
      console.log(yellow('\nNo files found matching your search.'))
      return
    }

    console.log(yellow(`\nFound ${files.length} matching files:\n`))
    files.forEach((file: any) => {
      const size = file.fileSizeInBytes 
        ? byteToSize(parseInt(file.fileSizeInBytes.toString())) 
        : '0 Bytes';

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

      console.log('CID:', file.cid || 'Not available')
      console.log('Name:', file.fileName || 'Not available')
      console.log('Size:', size)
      console.log('Type:', file.mimeType || 'Not available')
      console.log('Upload Time:', uploadTime)
      console.log()
    })

  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
} 