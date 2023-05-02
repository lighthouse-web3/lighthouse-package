import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

export type authResponse = {
  data: {
    access_token: string
  }
}

export default async (apiKey: string): Promise<authResponse> => {
  try {
    const authToken = (
      await axios.get(
        lighthouseConfig.lighthouseDataDepot +
          `/api/auth/lighthouse_auth`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          }
        }
      )
    ).data
    return { data: authToken }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
