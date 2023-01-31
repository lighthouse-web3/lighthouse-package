import { shareToAddress } from '@lighthouse-web3/kavach';

export default async (publicKey: string, shareTo: string[], cid: string, signedMessage: string) => {
  const { error } = await shareToAddress(publicKey, cid, signedMessage, shareTo);

  if (error) {
    throw error;
  }

  /*
    {
      data: {
        cid: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
        shareTo: [ '0x487fc2fE07c593EAb555729c3DD6dF85020B5160' ],
        status: "Success"
      }
    }
  */
  return { data: { cid, shareTo, status: 'Success' } };
};
