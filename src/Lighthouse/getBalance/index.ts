import axios from 'axios'
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
    const userDataUsage = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/user/user_data_usage`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
      )
    ).data
    /*
      return:
        { data: { dataLimit: 1073741824, dataUsed: 1062512300 } }
    */
    return { data: userDataUsage }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
