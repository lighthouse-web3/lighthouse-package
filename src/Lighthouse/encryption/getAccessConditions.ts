import axios from 'axios';
import { lighthouseConfig } from '../../lighthouse.config';

export default async (cid: string) => {
  try {
    const conditions = await axios.get(lighthouseConfig.lighthouseBLSNode + `/api/fileAccessConditions/get/${cid}`);

    return { data: conditions.data };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
