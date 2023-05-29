import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

export type publishRecordResponse = {
  data: {
    Name: string,
    Value: string
  }
}

export default async (cid: string, key: string, apiKey: string): Promise<publishRecordResponse> => {
  try {
    const response = await axios.get(
      lighthouseConfig.lighthouseAPI +
        `/api/ipns/publish_record?cid=${cid}&keyName=${key}`,
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
              "Name": "k51qzi5uqu5dm6uvby6428rfpcv1vcba6hxq6vcu52qtfsx3np4536jkr71gnu",
              "Value": "/ipfs/Qmd5MBBScDUV3Ly8qahXtZFqyRRfYSmUwEcxpYcV4hzKfW"
          }
        }
    */
    return { data: response.data }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
