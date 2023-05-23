import axios from 'axios'
import { lighthouseConfig } from '../../lighthouse.config'

type ipnsObject = {
  Name: string
  Id: string
}

export type removeRecordResponse = {
  data: {
    Keys: ipnsObject[],
  }
}

export default async (key: string, apiKey: string): Promise<removeRecordResponse> => {
  try {
    const response = await axios.delete(
      lighthouseConfig.lighthouseAPI +
        `/api/ipns/remove_key?keyName=${key}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )
    /*
      return:
        {
          data: { 
            Keys: [
                {
                    "Name": "3090a315e92c495ea36444f2bbaeefaf",
                    "Id": "k51qzi5uqu5dm8gfelll8own1epd9osmlig49il5mmphkrcxbnhydkmx101x15"
                }
            ]
          }
        }
    */
    return { data: response.data }
  } catch (error: any) {
    throw new Error(error.message)
  }
}
