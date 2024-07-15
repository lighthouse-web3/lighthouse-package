import { lighthouseConfig } from '../../lighthouse.config'

export type balanceResponse = {
  data: {
    dataLimit: number
    dataUsed: number
  }
}

export default async (apiKey: string): Promise<balanceResponse> => {
  try {
    // Get users data usage
    const response = await fetch(
      lighthouseConfig.lighthouseAPI + `/api/user/user_data_usage`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`)
    }

    const userDataUsage = (await response.json()) as any
    /*
      return:
        { data: { dataLimit: 1073741824, dataUsed: 1062512300 } }
    */
    return { data: userDataUsage }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
