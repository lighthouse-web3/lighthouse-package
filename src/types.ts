export interface IUploadProgressCallback {
  progress: number
  total: number
  uploaded: number
}

export interface IFileUploadedResponse {
  Name: string
  Hash: string
  Size: string
}

export type UploadFileReturnType<T extends boolean> = T extends true
  ? IFileUploadedResponse[]
  : IFileUploadedResponse

interface IProofData {
  pieceCID: string
  id: string
  lastUpdate: number
  fileProof: {
    inclusionProof: {
      proofIndex: {
        index: string
        path: string[]
      }
      proofSubtree: {
        index: string
        path: string[]
      }
    }
    indexRecord: {
      checksum: string
      proofIndex: string
      proofSubtree: number
      size: number
    }
    verifierData: {
      commPc: string
      sizePc: string
    }
  }
}

interface DealInfo {
  dealId: number
  storageProvider: string
}

export interface IPodsiData {
  pieceCID: string
  pieceSize: number
  carFileSize: number
  proof: IProofData
  dealInfo: DealInfo[]
}
