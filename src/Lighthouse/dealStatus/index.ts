import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

type dealData = {
  chainDealID: string
  endEpoch: string
  publishCID: string
  storageProvider: string
  dealStatus: string
  bundleId: string
  dealUUID: string
  startEpoch: string
  providerCollateral: string
  lastUpdate: number
  dealId: number
  miner: string
  content: number
}

export type dealResponse = {
  data: dealData[]
}

export default async (cid: string): Promise<dealResponse> => {
  try {
    const dealStatus = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/lighthouse/deal_status/?cid=${cid}`
      )
    ).data
    return { data: dealStatus }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
