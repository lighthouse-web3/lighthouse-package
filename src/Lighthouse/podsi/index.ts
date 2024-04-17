import axios from 'axios'
import { defaultConfig } from '../../lighthouse.config'

type Proof = {
  verifierData: {
    commPc: string
    sizePc: string
  }
  inclusionProof: {
    proofIndex: {
      index: string
      path: string[]
    }
    proofSubtree: {
      index: string
      path: string[]
    }
    indexRecord: {
      checksum: string
      proofIndex: string
      proofSubtree: number
      size: number
    }
  }
}

type DealInfo = {
  dealId: number
  storageProvider: string
  proof: Proof
}

type PODSIData = {
  pieceCID: string
  dealInfo: DealInfo[]
}

export default async (cid: string): Promise<{ data: PODSIData }> => {
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
