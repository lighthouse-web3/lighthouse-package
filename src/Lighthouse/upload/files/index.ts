import uploadFile from './node'
import uploadFileBrowser from './browser'

export default async (
  path: string | any, 
  apiKey: string, 
  uploadProgressCallback = (data: any) => {}
) => {
  // Upload File to IPFS
  // @ts-expect-error
  if (typeof window === "undefined") {
    return await uploadFile(path, apiKey)
  } else {
    return await uploadFileBrowser(path, apiKey, uploadProgressCallback)
  }
}
