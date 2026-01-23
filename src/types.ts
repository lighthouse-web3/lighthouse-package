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

export type Headers = {
  storageType?: string
}
export interface UploadFilesOptions {
  cidVersion?: number
  onProgress?: (data: IUploadProgressCallback) => void
  headers?: Headers
}
export interface UploadOptions {
  cidVersion?: number
  headers?: Headers
}
