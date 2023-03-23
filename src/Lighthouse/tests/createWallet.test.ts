import lighthouse from '..';

describe('create Wallet', () => {
  test('createWallet', async () => {
    const wallet = (await lighthouse.createWallet('Uchihas')).data.encryptedWallet;
    const walletParse = JSON.parse(wallet);
    expect(walletParse).toHaveProperty('address');
  }, 20000);

  test('createWallet null', async () => {
    try {
      const wallet = await lighthouse.createWallet('null');
    } catch (error: any) {
      expect(typeof error.message).toBe('string');
    }
  }, 20000);
});
