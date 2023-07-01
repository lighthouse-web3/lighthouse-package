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
