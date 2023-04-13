import { green } from 'kleur'
import { config } from './utils/getNetwork'

export default async function () {
  config.delete('LIGHTHOUSE_GLOBAL_WALLET')
  config.delete('LIGHTHOUSE_GLOBAL_PUBLICKEY')
  console.log(green('Wallet Removed!'))
}
