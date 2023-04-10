import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

export type getAccessConditionResponse = {
  data: any
}

export default async (cid: string): Promise<getAccessConditionResponse> => {
  try {
    const conditions = await axios.get(
      lighthouseConfig.lighthouseBLSNode +
        `/api/fileAccessConditions/get/${cid}`
    )

    return { data: conditions.data }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
