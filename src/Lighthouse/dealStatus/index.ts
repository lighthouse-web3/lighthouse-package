import { lighthouseConfig } from '../../lighthouse.config'

type dealData = {
  chainDealID: number
  endEpoch: number
  publishCID: string
  storageProvider: string
  dealStatus: string
  bundleId: string
  dealUUID: string
  startEpoch: number
  aggregateIn: string
  providerCollateral: string
  pieceCID: string
  payloadCid: string
  pieceSize: number
  carFileSize: number
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
    const response = await fetch(
      `${lighthouseConfig.lighthouseAPI}/api/lighthouse/deal_status?cid=${cid}`
    );
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }
    const dealStatus: dealData[] = await response.json() as dealData[];
    
    return { data: dealStatus };
  } catch (error: any) {
    throw new Error(error.message)
  }
}
