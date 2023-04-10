import chalk from 'chalk'
import { ethers } from 'ethers'
import { resolve } from 'path'
import readInput from './utils/readInput'
import { Spinner } from 'cli-spinner'
import lighthouse from '../Lighthouse'
import bytesToSize from './utils/byteToSize'
import { lighthouseConfig } from '../lighthouse.config'
import { getNetwork, config } from './utils/getNetwork'

const getQuote = async (path: string, publicKey: string, Spinner: any) => {
  const spinner = new Spinner('Getting Quote...')
  spinner.start()

  const quoteResponse: any = (await lighthouse.getQuote(path, publicKey)).data
  spinner.stop()
  process.stdout.clearLine(-1)
  process.stdout.cursorTo(0)

  if (!quoteResponse) {
    console.log(chalk.red('Error getting quote!'))
    console.log(chalk.yellow('Check if the wallet is imported!'))
    process.exit()
  }

  console.log(
    chalk.cyan('Name') +
      Array(30).fill('\xa0').join('') +
      chalk.cyan('Size') +
      Array(8).fill('\xa0').join('') +
      chalk.cyan('Type') +
      Array(20).fill('\xa0').join('')
  )

  for (let i = 0; i < quoteResponse.metaData.length; i++) {
    const fileName = quoteResponse.metaData[i].fileName
      .split(/\\/g)
      .slice(-1)[0]
      .substring(0, 20)
    console.log(
      fileName +
        Array(34 - (fileName ?? '').length)
          .fill('\xa0')
          .join('') +
        bytesToSize(quoteResponse.metaData[i].fileSize) +
        Array(
          12 - bytesToSize(quoteResponse.metaData[i].fileSize).toString().length
        )
          .fill('\xa0')
          .join('') +
        quoteResponse.metaData[i].mimeType
    )
  }

  console.log(
    '\r\n' +
      chalk.cyan('Summary') +
      '\r\nTotal Size: ' +
      bytesToSize(quoteResponse.totalSize)
  )

  console.log(
    'Data Limit: ' +
      bytesToSize(parseInt(quoteResponse.dataLimit)) +
      '\r\nData Used : ' +
      bytesToSize(parseInt(quoteResponse.dataUsed)) +
      '\r\nAfter Upload: ' +
      bytesToSize(
        parseInt(quoteResponse.dataLimit) -
          (parseInt(quoteResponse.dataUsed) + quoteResponse.totalSize)
      )
  )

  const remainingAfterUpload =
    parseInt(quoteResponse.dataLimit) -
    (parseInt(quoteResponse.dataUsed) + quoteResponse.totalSize)

  return {
    fileName: quoteResponse.metaData[0].fileName,
    fileSize: quoteResponse.metaData[0].fileSize,
    cost: quoteResponse?.totalCost,
    type: quoteResponse?.type,
    remainingAfterUpload: remainingAfterUpload,
  }
}

const uploadFile = async (
  path: string,
  signer: any,
  apiKey: string,
  network: string
) => {
  const spinner = new Spinner('Uploading...')
  spinner.start()

  const uploadResponse = (await lighthouse.upload(path, apiKey)).data

  spinner.stop()
  process.stdout.clearLine(-1)
  process.stdout.cursorTo(0)

  if (!uploadResponse.Hash) {
    console.log(chalk.red('Upload failed!'))
    console.log(
      chalk.yellow('Check if api key is correct or create a new key!')
    )
    process.exit()
  }

  console.log(
    chalk.green('File Uploaded, visit following url to view content!\r\n') +
      chalk.cyan(
        'Visit: ' +
          'https://gateway.lighthouse.storage/ipfs/' +
          uploadResponse.Hash +
          '\r\n'
      ) +
      chalk.cyan(
        Array(7).fill('\xa0').join('') +
          'https://ipfs.io/ipfs/' +
          uploadResponse.Hash
      )
  )

  console.log('CID: ' + uploadResponse.Hash)
  return
}

export default async function (_path: string) {
  if (!_path) {
    console.log(
      'lighthouse-web3 upload <path>\r\n\r\n' +
        chalk.green('Description: ') +
        'Upload a file\r\n\r\n' +
        chalk.cyan('Options:\r\n') +
        Array(3).fill('\xa0').join('') +
        '--path: Required, path to file\r\n\r\n' +
        chalk.magenta('Example:') +
        Array(3).fill('\xa0').join('') +
        'lighthouse-web3 upload /home/cosmos/Desktop/ILoveAnime.jpg\r\n'
    )
  } else {
    try {
      // Import nodejs specific library
      const path = resolve(process.cwd(), _path)
      const network = getNetwork()

      // Display Quote
      const quoteResponse = await getQuote(
        path,
        config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY') as string,
        Spinner
      )

      // Upload
      console.log(
        chalk.green(
          'Carefully check the above details are correct, then confirm to complete this upload'
        ) + ' Y/n'
      )

      const options = {
        prompt: '',
      }

      const selected: any = await readInput(options)

      if (
        selected.trim() === 'n' ||
        selected.trim() === 'N' ||
        selected.trim() === 'no'
      ) {
        throw new Error('Canceled Upload')
      }

      if (!config.get('LIGHTHOUSE_GLOBAL_API_KEY')) {
        throw new Error('Please create api-key first: use api-key command')
      }

      if (quoteResponse.remainingAfterUpload < 0) {
        throw new Error(
          'File size larger than allowed limit. Please Recharge!!!'
        )
      }

      const _options = {
        prompt: 'Enter your password: ',
        silent: true,
        default: '',
      }

      const password: any = await readInput(_options)

      const decryptedWallet = ethers.Wallet.fromEncryptedJsonSync(
        config.get('LIGHTHOUSE_GLOBAL_WALLET') as string,
        password.trim()
      )

      if (!decryptedWallet) {
        throw new Error('Incorrect password!')
      }

      const provider = new ethers.providers.JsonRpcProvider(
        lighthouseConfig[network]['rpc']
      )
      const signer = new ethers.Wallet(decryptedWallet.privateKey, provider)
      const apiKey = config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
      await uploadFile(path, signer, apiKey, network)
    } catch (error: any) {
      console.log(chalk.red(error.message))
    }
  }
}
