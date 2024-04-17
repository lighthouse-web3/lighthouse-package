import { green, red, bold, yellow } from 'kleur'
import { isCID } from '../Lighthouse/utils/util'
import getPodsi from '../Lighthouse/podsi'

export default async function (cid: any, options: any) {
  if (JSON.stringify(cid) === '{}') {
    options.help()
  } else {
    try {
      if (!isCID(cid)) {
        throw new Error('Invalid CID')
      }
      const { data } = await getPodsi(cid)
      console.log(bold().cyan('Piece Info:'))
      console.log(green('Piece CID:'), data.pieceCID)

      console.log('\n' + bold().cyan('Proof Data:'))

      console.log('\n' + bold().cyan('Inclusion Proof:'))
      console.log(
        green('Proof Index:'),
        data.dealInfo[0].proof.inclusionProof.proofIndex.index
      )
      console.log(green('Proof Paths:'))
      data.dealInfo[0].proof.inclusionProof.proofIndex.path.forEach((path) => {
        console.log(yellow('  -'), path)
      })

      console.log('\n' + bold().cyan('Proof Subtree:'))
      console.log(
        green('Index:'),
        data.dealInfo[0].proof.inclusionProof.proofSubtree.index
      )
      console.log(green('Paths:'))
      data.dealInfo[0].proof.inclusionProof.proofSubtree.path.forEach((path) => {
        console.log(yellow('  -'), path)
      })

      console.log('\n' + bold().cyan('Deal Info:'))
      data.dealInfo.forEach((deal) => {
        console.log(green('Deal ID:'), deal.dealId)
        console.log(green('Storage Provider:'), deal.storageProvider)
      })
    } catch (error: any) {
      console.log(red(error.message))
      process.exit(0)
    }
  }
}
