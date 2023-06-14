import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

type fileObject = {
  publicKey: string
  fileName: string
  mimeType: string
  txHash: string
  status: string
  createdAt: number
  fileSizeInBytes: string
  cid: string
  id: string
  lastUpdate: number
  encryption: boolean
}

export type uploadsResponseType = {
  data: {
    fileList: fileObject[]
    totalFiles: number
  }
}

export default async (
  publicKey: string,
  pageNo = 1
): Promise<uploadsResponseType> => {
  try {
    const uploads = (
      await axios.get(
        lighthouseConfig.lighthouseAPI +
          `/api/user/files_uploaded?publicKey=${publicKey}&pageNo=${pageNo}`
      )
    ).data

    /*
      {
        data: {
          "fileList":[
            {
              publicKey: '0xa3c960b3ba29367ecbcaf1430452c6cd7516f588',
              fileName: 'flow1.png',
              mimeType: 'image/png',
              txHash: '0x7c9ee1585be6b85bef471a27535fb4b8d7551340152c36c025743c36fd0d1acc',
              status: 'testnet',
              createdAt: 1662880331683,
              fileSizeInBytes: '31735',
              cid: 'QmZvWp5Xdyi7z5QqGdXZP63QCBNoNvjupF1BohDULQcicA',
              id: 'aaab8053-0f1e-4482-9f84-d413fad14266',
              lastUpdate: 1662883207149,
              encryption: true
            },
          ],
          "totalFiles": 75
        }
      }
    */
    return { data: uploads }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
