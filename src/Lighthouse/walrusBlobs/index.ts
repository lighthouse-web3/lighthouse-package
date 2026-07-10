import { lighthouseConfig } from '../../lighthouse.config'

export type walrusBlobsResponse = {
  blobIds: string[]
}

export default async (cid: string): Promise<walrusBlobsResponse> => {
  try {
    const response = await fetch(
      `${lighthouseConfig.lighthouseAPI}/api/lighthouse/walrus_blobs?cid=${cid}`
    )
    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`)
    }
    const walrusBlobs: walrusBlobsResponse = (await response.json()) as walrusBlobsResponse

    return { blobIds: walrusBlobs.blobIds }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
