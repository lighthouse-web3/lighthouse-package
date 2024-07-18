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

export type DealParameters = {
  miner: string[]
  num_copies: number
  repair_threshold: number
  renew_threshold: number
  deal_duration: number
  network: string
}

export type UploadFileReturnType<T extends boolean> = T extends true
  ? IFileUploadedResponse[]
  : IFileUploadedResponse
