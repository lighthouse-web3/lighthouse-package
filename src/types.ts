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
  miner: string[],
  num_copies: Number,
  repair_threshold: Number,
  renew_threshold: Number,
  deal_duration: Number,
  network: string
}

export type UploadFileReturnType<T extends boolean> = T extends true
  ? IFileUploadedResponse[]
  : IFileUploadedResponse
