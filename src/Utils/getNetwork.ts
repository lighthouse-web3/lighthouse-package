// import Configstore from 'configstore';
// const config = new Configstore('lighthouseSdk');
import { lighthouseConfig } from '../lighthouse.config';

function getNetwork() {
  return lighthouseConfig.network;
}

export { getNetwork };
