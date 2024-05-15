import { addressValidator } from '../utils/util'
import { getAuthMessage } from '@lighthouse-web3/kavach'

export type authMessageResponse = {
  data: {
    message: string | null
  }
}

export default async (publicKey: string): Promise<authMessageResponse> => {
  const address = addressValidator(publicKey)
  if (!address) {
    throw new Error('Invalid public Key')
  }
  const { error, message } = await getAuthMessage(publicKey)

  if (error) {
    throw error
  }
  /*
    return:
      { data: { message: 'Please sign this message to prove you are owner of this account: 269e5d45-caf7-474d-8167-ab6b140e0249' } }
  */
  return { data: { message } }
}
