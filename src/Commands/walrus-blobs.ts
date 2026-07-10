import { yellow, red } from 'kleur'
import lighthouse from '../Lighthouse'

export default async function (cid: string) {
  try {
    if (!cid) {
      throw new Error('Please provide a CID.')
    }

    const { blobIds } = await lighthouse.walrusBlobs(cid)

    console.log(
      yellow('\r\nCID:') + Array(9).fill('\xa0').join('') + cid
    )

    if (blobIds.length === 0) {
      console.log(yellow('\r\nNo walrus blobs found for this CID'))
      return
    }

    console.log(
      '\r\n' +
        Array(4).fill('\xa0').join('') +
        yellow('Blob ID')
    )

    for (let i = 0; i < blobIds.length; i++) {
      console.log(
        Array(4).fill('\xa0').join('') + blobIds[i] + '\r\n'
      )
    }
  } catch (error: any) {
    console.log(red(error.message))
    process.exit(0)
  }
}
