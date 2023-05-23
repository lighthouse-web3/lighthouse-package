import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

export type generateKeyResponse = {
  data: {
    ipnsName: string,
    ipnsId: string
  }
}

export default async (apiKey: string): Promise<generateKeyResponse> => {
  try {
    const key = await axios.get(
      lighthouseConfig.lighthouseAPI +
        `/api/ipns/generate_key`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )
    /*
      return:
        {
          data: {
              "ipnsName": "6cda213e3a534f8388665dee77a26458",
              "ipnsId": "k51qzi5uqu5dm6uvby6428rfpcv1vcba6hxq6vcu52qtfsx3np4536jkr71gnu"
          }
        }
    */
    return { data: key.data }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
