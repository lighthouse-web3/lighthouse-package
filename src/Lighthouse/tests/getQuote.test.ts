import lighthouse from '..';
import { resolve } from 'path';

describe('getQuote', () => {
  test('getQuote File', async () => {
    const path = resolve(process.cwd(), 'src/Utils/testImages/testImage1.svg');
    const quote = (await lighthouse.getQuote(path, '0x487fc2fE07c593EAb555729c3DD6dF85020B5160')).data;

    expect(quote).toHaveProperty('dataLimit');
    expect(quote).toHaveProperty('dataUsed');
    expect(typeof quote.totalSize).toBe('number');
  }, 20000);

  test('getQuote Folder', async () => {
    const path = resolve(process.cwd(), 'src/Utils/testImages');
    const quote = (await lighthouse.getQuote(path, '0x487fc2fE07c593EAb555729c3DD6dF85020B5160')).data;

    expect(quote).toHaveProperty('dataLimit');
    expect(quote).toHaveProperty('dataUsed');
    expect(typeof quote.totalSize).toBe('number');
  }, 20000);
});
