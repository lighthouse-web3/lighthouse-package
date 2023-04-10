import chalk from 'chalk'
import { getNetwork, config } from './utils/getNetwork'

export default async function (data: any) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')) {
      throw new Error('Please import wallet first!')
    }

    console.log(
      chalk.yellow('Public Key:') +
        Array(4).fill('\xa0').join('') +
        config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')
    )

    console.log(
      chalk.yellow('Network:') + Array(7).fill('\xa0').join('') + getNetwork()
    )
  } catch (error: any) {
    console.log(chalk.red(error.message))
  }
}
