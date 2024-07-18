import { lighthouseConfig } from '../../lighthouse.config'

export type getAccessConditionResponse = {
  data: any
}

export default async (cid: string): Promise<getAccessConditionResponse> => {
  try {
    const response = await fetch(
      lighthouseConfig.lighthouseBLSNode +
        `/api/fileAccessConditions/get/${cid}`
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const conditions = await response.json()

    return { data: conditions }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
