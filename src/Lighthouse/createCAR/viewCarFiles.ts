import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

type metadata = {
  pieceCid: string
  fileName: string
  payloadCid: string
  mimeType: string
  userName: string
  createdAt: number
  carSize: number
  lastUpdate: number
  fileStatus: string
  fileSize: number
  id: string
  pieceSize: number
}
export type response = {
  data: [metadata]
}

export default async (pageNo: number, authToken: string): Promise<response> => {
  try {
    const endpoint = `${lighthouseConfig.lighthouseDataDepot}/api/data/get_user_uploads?pageNo=${pageNo}`

    const fileList = (
      await axios.get(
        endpoint,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        }
      )
    ).data
    
    return { data: fileList }
  } catch (error: any) {
    throw new Error(error)
  }
}
