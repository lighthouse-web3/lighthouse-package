import { lighthouseConfig } from '../../lighthouse.config'

export type publishRecordResponse = {
  data: {
    Name: string
    Value: string
  }
}

export default async (
  cid: string,
  key: string,
  apiKey: string
): Promise<publishRecordResponse> => {
  try {
    const url =
      lighthouseConfig.lighthouseAPI +
      `/api/ipns/publish_record?cid=${cid}&keyName=${key}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`)
    }

    const data = (await response.json()) as any
    /*
      return:
        {
          data: {
              "Name": "k51qzi5uqu5dm6uvby6428rfpcv1vcba6hxq6vcu52qtfsx3np4536jkr71gnu",
              "Value": "/ipfs/Qmd5MBBScDUV3Ly8qahXtZFqyRRfYSmUwEcxpYcV4hzKfW"
          }
        }
    */
    return { data: data }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
