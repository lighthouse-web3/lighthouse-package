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
    const response = await fetch(
      defaultConfig.lighthouseAPI + `/api/lighthouse/get_proof?cid=${cid}`
    )
    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Proof Doesn't exist yet")
      }
      throw new Error(`Request failed with status code ${response.status}`)
    }
    const data = (await response.json()) as PODSIData
    return { data }
  } catch (error: any) {
    if (error?.response?.status === 400) {
      throw new Error("Proof Doesn't exist yet")
    }
    throw new Error(error.message)
  }
}
