import axios from 'axios';
import { lighthouseConfig } from '../../lighthouse.config';

export default async (cid: string) => {
  try {
    const dealStatus = (await axios.get(lighthouseConfig.lighthouseAPI + `/api/lighthouse/deal_status/?cid=${cid}`))
      .data;
    return { data: { dealStatus } };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
