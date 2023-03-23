import axios from 'axios';
import { lighthouseConfig } from '../../lighthouse.config';

export default async (fileName: string, cid: string) => {
  try {
    const response = (
      await axios.post(lighthouseConfig.lighthouseAPI + `/api/lighthouse/add_cid`, {
        name: fileName,
        cid: cid,
      })
    ).data;

    return { data: response };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
