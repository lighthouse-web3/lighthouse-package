import { recoverKey, recoverShards } from '@lighthouse-web3/kavach'

export type fetchEncryptionKeyResponse = {
  data: {
    key: string | null
  }
}

export default async (
  cid: string,
  publicKey: string,
  signedMessage: string,
  dynamicData = {},
  shardCount = 3
): Promise<fetchEncryptionKeyResponse> => {
  const { error, shards } = await recoverShards(publicKey, cid, signedMessage, shardCount, dynamicData)
  if (error) {
    throw error
  }
  const { masterKey: key, error: recoverError } = await recoverKey(shards)

  if (recoverError) {
    throw recoverError
  }
  return { data: { key: key } }
}
