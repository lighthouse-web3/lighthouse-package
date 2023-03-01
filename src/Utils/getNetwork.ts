import Conf from 'conf';
import { lighthouseConfig } from '../lighthouse.config';

const config = new Conf();

function getNetwork() {
  return config.get('LIGHTHOUSE_GLOBAL_NETWORK') ? config.get('LIGHTHOUSE_GLOBAL_NETWORK') : lighthouseConfig.network;
}

export { getNetwork, config };
