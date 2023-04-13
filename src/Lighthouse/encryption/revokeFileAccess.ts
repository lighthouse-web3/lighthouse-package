import { revokeAccess } from '@lighthouse-web3/kavach'

export type revokeResponse = {
  data: {
    cid: string
    revokeTo: string | string[]
    status: string
  }
}

export default async (
  publicKey: string,
  revokeTo: string | string[],
  cid: string,
  signedMessage: string
): Promise<revokeResponse> => {
  const _revokeTo = Array.isArray(revokeTo) ? revokeTo : [revokeTo]

  // send encryption key
  const { error } = await revokeAccess(publicKey, cid, signedMessage, _revokeTo)

  if (error) {
    throw error
  }
  /*
    {
      data: {
        cid: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
        revokeTo: '0x487fc2fE07c593EAb555729c3DD6dF85020B5160',
        status: "Success"
      }
    }
  */
  return { data: { cid, revokeTo, status: 'Success' } }
}
