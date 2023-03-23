import { ethers } from 'ethers';
import lighthouse from '../../Lighthouse';

export const sign_auth_message = async (privateKey: string) => {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, provider);
  const messageRequested = (await lighthouse.getAuthMessage(signer.address.toLocaleLowerCase())).data.message;
  const signedMessage = await signer.signMessage(messageRequested);
  return signedMessage;
};
