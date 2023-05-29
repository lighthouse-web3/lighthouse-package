import { green, cyan, yellow, white, red } from 'kleur'
import lighthouse from '../Lighthouse'
import { config } from './utils/getNetwork'

export default async function (_options: any) {
  try {
    if (!(config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string)) {
      throw new Error('Please create an API key first!')
    }

    if(_options.generateKey || _options.gen) {
      const key = await lighthouse.generateKey(config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string)
      console.log(
        yellow('ipnsName: ') +
          white(key.data.ipnsName) +
          '\r\n' +
          yellow('ipnsId: ') +
          white(key.data.ipnsId)
      )
    }

    if((
        _options.publish || _options.pub) &&
        (_options.cid || _options.c) &&
        (_options.key || _options.k)
      ) {
      const publishResponse = await lighthouse.publishRecord(
        _options.cid,
        _options.key,
        config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string
      )
      console.log(
        yellow('Published: ') +
        '\r\n' +
        cyan(
          'Visit: ' +
            'https://gateway.lighthouse.storage/ipns/' +
            publishResponse.data.Name
        )
      )
    }

    if(_options.remove || _options.r) {
      const removeRes = await lighthouse.removeKey(_options.remove, config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string)
      console.log(
        green('Record Removed!!!')
      )
    }

    if(_options.list || _options.l) {
      const keys = await lighthouse.getAllKeys(config.get('LIGHTHOUSE_GLOBAL_API_KEY') as string)
      if(keys.data.length>0){
        console.log(yellow('List of ipns records: \r\n'))
        for(let i=0; i<keys.data.length; i++) {
          console.log(
            yellow('  Key:     ') + keys.data[i].ipnsName + '\r\n' +
            yellow('  IPNS ID: ') + keys.data[i].ipnsId + '\r\n' +
            yellow('  CID:     ') + keys.data[i].cid + '\r\n'
          )
        }
      }
    }

  } catch (error: any) {
    console.log(red(error.message))
  }
}
