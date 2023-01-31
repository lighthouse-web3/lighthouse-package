import Configstore from 'configstore';

const config = new Configstore('lighthouseSdk');
import { lighthouseConfig } from '../lighthouse.config';

function getNetwork() {
  return config.get('LIGHTHOUSE_GLOBAL_NETWORK') ? config.get('LIGHTHOUSE_GLOBAL_NETWORK') : lighthouseConfig.network;
}

export { getNetwork, config };
