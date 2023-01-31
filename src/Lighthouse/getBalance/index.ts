import axios from 'axios';
import { lighthouseConfig } from '../../lighthouse.config';

export default async (publicKey: string) => {
  try {
    // Get users data usage
    const userDataUsage = (
      await axios.get(lighthouseConfig.lighthouseAPI + `/api/user/user_data_usage?publicKey=${publicKey}`)
    ).data;
    /*
      return:
        { data: { dataLimit: 1073741824, dataUsed: 1062512300 } }
    */
    return { data: userDataUsage };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
