import axios from 'axios'
import { defaultConfig } from '../../lighthouse.config'
import { IPodsiData } from '../../types'

export default async (cid: string): Promise<{ data: IPodsiData }> => {
  try {
    const response = await axios.get(
      defaultConfig.lighthouseAPI + `/api/lighthouse/get_proof?cid=${cid}`
    )
    return { data: response.data }
  } catch (error: any) {
    if (error?.response?.status === 400) {
      throw new Error("Proof Doesn't exist yet")
    }
    throw new Error(error.message)
  }
}
