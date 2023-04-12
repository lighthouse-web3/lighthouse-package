import chalk from 'chalk'
import lighthouse from '../Lighthouse'
import bytesToSize from './utils/byteToSize'

const showResponse = (cid: string, dealStatus: any) => {
  console.log(
    chalk.yellow('\r\nCID:') +
      Array(9).fill('\xa0').join('') +
      cid +
      chalk.yellow('\r\nSize:') +
      Array(8).fill('\xa0').join('') +
      bytesToSize(dealStatus[0]['content']) +
      '\r\n'
  )

  console.log(
    Array(20).fill('\xa0').join('') +
      chalk.yellow('Miner : ') +
      Array(10).fill('\xa0').join('') +
      chalk.yellow('DealId: ')
  )

  for (let i = 0; i < dealStatus.length; i++) {
    const gap = 10 + (8 - dealStatus[i]['miner'].length)
    console.log(
      Array(20).fill('\xa0').join('') +
        dealStatus[i]['miner'] +
        Array(gap).fill('\xa0').join('') +
        dealStatus[i]['dealId']
    )
  }
  console.log(
    chalk.green('\r\nView deals at filfox URL:\r\n') +
      Array(4).fill('\xa0').join('') +
      'https://filfox.info/en/deal/' +
      dealStatus[0]['dealId']
  )
}

export default async function (data: any, options: any) {
  if (JSON.stringify(data) === '{}') {
    console.log(chalk.yellow('Select an option:'))
    options.help()
  } else {
    try {
      const dealStatus = (await lighthouse.dealStatus(data)).data
      dealStatus.length === 0
        ? console.log('Deal creation in progress')
        : showResponse(data.cid, dealStatus)
    } catch (error: any) {
      console.log(chalk.red(error.message))
    }
  }
}
 