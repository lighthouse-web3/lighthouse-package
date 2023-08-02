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
      console.log(green('Piece Size:'), data.pieceSize)
      console.log(green('Car File Size:'), data.carFileSize)

      console.log('\n' + bold().cyan('Proof Data:'))
      console.log(green('Piece CID:'), data.proof.pieceCID)
      console.log(green('ID:'), data.proof.id)
      console.log(
        green('Last Update:'),
        new Date(data.proof.lastUpdate * 1000).toLocaleString()
      )

      console.log('\n' + bold().cyan('Inclusion Proof:'))
      console.log(
        green('Proof Index:'),
        data.proof.fileProof.inclusionProof.proofIndex.index
      )
      console.log(green('Proof Paths:'))
      data.proof.fileProof.inclusionProof.proofIndex.path.forEach((path) => {
        console.log(yellow('  -'), path)
      })

      console.log('\n' + bold().cyan('Proof Subtree:'))
      console.log(
        green('Index:'),
        data.proof.fileProof.inclusionProof.proofSubtree.index
      )
      console.log(green('Paths:'))
      data.proof.fileProof.inclusionProof.proofSubtree.path.forEach((path) => {
        console.log(yellow('  -'), path)
      })

      console.log('\n' + bold().cyan('Index Record:'))
      console.log(green('Checksum:'), data.proof.fileProof.indexRecord.checksum)
      console.log(
        green('Proof Index:'),
        data.proof.fileProof.indexRecord.proofIndex
      )
      console.log(
        green('Proof Subtree:'),
        data.proof.fileProof.indexRecord.proofSubtree
      )
      console.log(green('Size:'), data.proof.fileProof.indexRecord.size)

      console.log('\n' + bold().cyan('Verifier Data:'))
      console.log(green('Comm Pc:'), data.proof.fileProof.verifierData.commPc)
      console.log(green('Size Pc:'), data.proof.fileProof.verifierData.sizePc)

      console.log('\n' + bold().cyan('Deal Info:'))
      data.dealInfo.forEach((deal) => {
        console.log(green('Deal ID:'), deal.dealId)
        console.log(green('Storage Provider:'), deal.storageProvider)
      })
    } catch (error: any) {
      console.log(red(error.message))
    }
  }
}
