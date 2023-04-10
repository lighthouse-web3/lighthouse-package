import { recoverKey, recoverShards } from '@lighthouse-web3/kavach'

export type fetchEncryptionKeyResponse = {
  data: {
    key: string | null
  }
}

export default async (
  cid: string,
  publicKey: string,
  signedMessage: string
): Promise<fetchEncryptionKeyResponse> => {
  const { error, shards } = await recoverShards(publicKey, cid, signedMessage)
  if (error) {
    throw error
  }
  const { masterKey: key, error: recoverError } = await recoverKey(shards)

  if (recoverError) {
    throw recoverError
  }
  /*
    return:
      {
        data: {
          key: '519862401c52447c87eb4d41ea5e99f4c6b82a5914cf4086a61f25ef3128122d'
        }
      }
  */
  return { data: { key: key } }
}
