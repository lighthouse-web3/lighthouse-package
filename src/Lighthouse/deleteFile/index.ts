import { lighthouseConfig } from '../../lighthouse.config'

export type deleteFileResponseType = {
  data: {
    message: string
  }
}

export default async (
  authToken: string,
  fileId: string
): Promise<deleteFileResponseType> => {
  try {
    const response = await fetch(
      `${lighthouseConfig.lighthouseAPI}/api/user/delete_file?id=${fileId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`)
    }

    const result = (await response.json()) as any
    /*
      Example response:
      {
        "message": "File deleted successfully."
      }
    */
    return { data: result }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
