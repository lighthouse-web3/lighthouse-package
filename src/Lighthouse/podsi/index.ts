import { defaultConfig } from '../../lighthouse.config'
import { resilientFetch } from '../utils/resilientFetch'
import { defaultApiConfig } from '../utils/apiConfig'

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
    const response = await resilientFetch(
      defaultConfig.lighthouseAPI + `/api/lighthouse/get_proof?cid=${cid}`,
      {
        retryOptions: {
          ...defaultApiConfig.retryOptions,
          retryCondition: (error: any) => {
            // Don't retry on 400 errors for PODSI - proof might not exist yet
            if (error.status === 400) return false
            // Use default retry logic for other errors
            return error.status === 429 || error.status >= 502
          }
        },
        rateLimiter: defaultApiConfig.rateLimiter,
        timeout: defaultApiConfig.timeout,
      }
    )
    
    const data = (await response.json()) as PODSIData
    return { data }
  } catch (error: any) {
    if (error.status === 400) {
      throw new Error("Proof Doesn't exist yet")
    }
    throw new Error(error.message)
  }
}
