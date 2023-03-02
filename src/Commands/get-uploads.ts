import chalk from 'chalk';
import { config } from '../Utils/getNetwork';
import bytesToSize from '../Utils/byteToSize';
import lighthouse from '../Lighthouse';

export default async function () {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')) {
      throw new Error('Wallet not created/imported');
    }

    const response = (await lighthouse.getUploads(config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY') as string)).data.uploads;

    console.log(
      '\r\n' +
        Array(4).fill('\xa0').join('') +
        chalk.yellow('CID') +
        Array(47).fill('\xa0').join('') +
        chalk.yellow('File Name') +
        Array(5).fill('\xa0').join('') +
        chalk.yellow('File Size'),
    );
    for (let i = 0; i < response.length; i++) {
      console.log(
        Array(4).fill('\xa0').join('') +
          response[i]['cid'] +
          Array(4).fill('\xa0').join('') +
          response[i]['fileName'].substring(0, 10) +
          Array(4).fill('\xa0').join('') +
          bytesToSize(response[i]['fileSizeInBytes']) +
          '\r\n',
      );
    }
  } catch (error: any) {
    console.log(chalk.red(error.message));
  }
}
