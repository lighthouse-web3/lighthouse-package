import { accessControl, ChainType } from '@lighthouse-web3/kavach';

export default async (
  publicKey: string,
  cid: string,
  signedMessage: string,
  conditions: any,
  aggregator: string | undefined = undefined,
  chainType: ChainType = 'evm',
) => {
  // send encryption key
  const { isSuccess, error } = await accessControl(publicKey, cid, signedMessage, conditions, aggregator, chainType);

  if (error) {
    throw error;
  }
  return { data: { cid: cid, status: 'Success' } };
};
