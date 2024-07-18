import { lighthouseConfig } from '../../lighthouse.config'

export type generateKeyResponse = {
  data: {
    ipnsName: string
    ipnsId: string
  }
}

export default async (apiKey: string): Promise<generateKeyResponse> => {
  try {
    const response = await fetch(
      lighthouseConfig.lighthouseAPI + `/api/ipns/generate_key`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json', // Ensure headers are set for JSON
        },
      }
    )
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`)
    }
    const key = (await response.json()) as any
    /*
      return:
        {
          data: {
              "ipnsName": "6cda213e3a534f8388665dee77a26458",
              "ipnsId": "k51qzi5uqu5dm6uvby6428rfpcv1vcba6hxq6vcu52qtfsx3np4536jkr71gnu"
          }
        }
    */
    return { data: key }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
