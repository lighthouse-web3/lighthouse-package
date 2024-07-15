import { lighthouseConfig } from '../../lighthouse.config'

export type apiKeyResponse = {
  data: {
    apiKey: string
  }
}

export default async (
  publicKey: string,
  signedMessage: string
): Promise<apiKeyResponse> => {
  try {
    const response = await fetch(
      lighthouseConfig.lighthouseAPI + `/api/auth/create_api_key`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: publicKey,
          signedMessage: signedMessage,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const apiKey = (await response.json()) as string
    /*
      return:
        { data: { apiKey: '489a497e-4e0c-4cb5-9522-ca07740f6dfb' } }
    */
    return { data: { apiKey } }
  } catch (error: any) {
    throw new Error(error.response.data)
  }
}
