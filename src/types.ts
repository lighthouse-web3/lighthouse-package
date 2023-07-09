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
