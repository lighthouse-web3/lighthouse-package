import { getNetwork } from '../src/Utils/getNetwork';

export default async () => {
  try {
    //true
    // if (true) {
    //   throw new Error('Please import wallet first!');
    // }

    console.log('Public Key:' + Array(4).fill('\xa0').join('') + '');

    console.log('Network:' + Array(7).fill('\xa0').join('') + getNetwork());
  } catch (error: any) {
    console.log(error.message);
  }
};
