import { yellow, red } from 'kleur'
import { Spinner } from 'cli-spinner'
import lighthouse from '../Lighthouse'
import byteToSize from './utils/byteToSize'
import { config } from './utils/getNetwork'

export default async function (cid: string, options: any) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_API_KEY')) {
      throw new Error('API key not found. Please set up your API key first.')
    }

    if (!cid) {
      throw new Error('Please provide a CID')
    }

    const spinner = new Spinner('Fetching file information... %s')
    spinner.start()

    const uploadsResponse = await lighthouse.getUploads(
      config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
    )

    const dealResponse = await lighthouse.dealStatus(cid)

    spinner.stop()
    process.stdout.clearLine(-1, () => {})
    process.stdout.cursorTo(0)

    const file = uploadsResponse.data.fileList.find((f: any) => f.cid === cid)
    if (!file) {
      throw new Error('File not found with the given CID')
    }

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

    console.log(yellow('\nFile Information:'))
    console.log('CID:', file.cid || 'Not available')
    console.log('Name:', file.fileName || 'Not available')
    console.log('Size:', file.fileSizeInBytes ? byteToSize(parseInt(file.fileSizeInBytes.toString())) : '0 Bytes')
    console.log('Type:', file.mimeType || 'Not available')
    console.log('Upload Time:', uploadTime)
    
    if (dealResponse?.data?.[0]) {
      const deal = dealResponse.data[0];
      console.log('\nDeal Status:')
      console.log('Deal ID:', deal.dealId || 'Not available')
      console.log('Status:', deal.dealStatus || 'Not available')
      console.log('Provider:', deal.storageProvider || 'Not available')
    } else {
      console.log('\nDeal Status: No deal information available')
    }

  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
} 