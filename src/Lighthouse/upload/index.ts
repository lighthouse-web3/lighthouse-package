import uploadFile from './uploadFile';

export default async (path: string, apiKey: string) => {
  // Upload File to IPFS
  return await uploadFile(path, apiKey);
};
