import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

type ipnsObject = {
  ipnsName: string
  ipnsId: string
  publicKey: string
  cid: string
  lastUpdate: number
}

export type keyDataResponse = {
  data: ipnsObject[]
}

export default async (apiKey: string): Promise<keyDataResponse> => {
  try {
    const response = await fetch(
      lighthouseConfig.lighthouseAPI + `/api/ipns/get_ipns_records`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    )
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`)
    }
    const data = (await response.json()) as ipnsObject[]
    /*
      return:
        {
          data: [
            {
              "ipnsName": "6cda213e3a534f8388665dee77a26458",
              "ipnsId": "k51qzi5uqu5dm6uvby6428rfpcv1vcba6hxq6vcu52qtfsx3np4536jkr71gnu",
              "publicKey": "0xc88c729ef2c18baf1074ea0df537d61a54a8ce7b",
              "cid": "Qmd5MBBScDUV3Ly8qahXtZFqyRRfYSmUwEcxpYcV4hzKfW",
              "lastUpdate": 1684855771773
            }
          ]
        }
    */
    return { data: data }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
