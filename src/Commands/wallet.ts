import { red, yellow } from 'kleur'
import { getNetwork, config } from './utils/getNetwork'

export default async function (data: any) {
  try {
    if (!config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')) {
      throw new Error('Please import wallet first!')
    }

    console.log(
      yellow('Public Key:') +
        Array(4).fill('\xa0').join('') +
        config.get('LIGHTHOUSE_GLOBAL_PUBLICKEY')
    )

    console.log(
      yellow('Network:') + Array(7).fill('\xa0').join('') + getNetwork()
    )
  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
}
