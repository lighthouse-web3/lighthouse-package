export interface IUploadProgressCallback {
  progress: number
}

export interface IFileUploadedResponse {
  Name: string
  Hash: string
  Size: string
}

export type UploadFileReturnType<T extends boolean> = T extends true
  ? IFileUploadedResponse[]
  : IFileUploadedResponse
