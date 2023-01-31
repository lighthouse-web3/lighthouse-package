import { lighthouseConfig } from '../../lighthouse.config';

export default (network: string): { data: string } => {
  return { data: (lighthouseConfig[network] as any)['lighthouse_contract_address'] };
};
