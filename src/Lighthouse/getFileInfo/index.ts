import { isCID } from '../utils/util'
import { lighthouseConfig } from '../../lighthouse.config'

export type fileInfoType = {
  data: {
    fileSizeInBytes: string
    cid: string
    encryption: boolean
    fileName: string
    mimeType: string
  }
}

export default async (cid: string): Promise<fileInfoType> => {
  try {
    // cid check
    if (!isCID(cid)) {
      throw new Error('Invalid CID')
    }

    // get file info
    const response = await fetch(
      `${lighthouseConfig.lighthouseAPI}/api/lighthouse/file_info?cid=${cid}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const fileInfo = (await response.json()) as any
    /*
      return:
        {
          "fileSizeInBytes":"15256",
          "cid":"QmWC9AkGa6vSbR4yizoJrFMfmZh4XjZXxvRDknk2LdJffc",
          "encryption":false,
          "fileName":"testImages",
          "mimeType":null,
        }
    */
    return { data: fileInfo }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
