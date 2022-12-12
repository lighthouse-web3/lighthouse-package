export type IpfsFileResponse = {
  Name: string;
  Hash: string;
  Size: string | number;
};
export type Address = string;

export type ErrorValue = string | Array<string> | object | any;

export type MetaData = {
  fileSize: string | number;
  mimeType: string;
  fileName: string;
};

export type GetQuota = {
  metaData: MetaData[];
  dataLimit: string;
  dataUsed: string;
  totalSize: string;
};

export function upload(
  path: string,
  apiKey: string
): Promise<{ data: IpfsFileResponse }>;

export function uploadText(
  text: string,
  apiKey: string
): Promise<{ data: IpfsFileResponse }>;

export function uploadEncrypted(
  sourcePath: string,
  apiKey: string,
  publicKey: Address,
  signed_message: string
): Promise<{ data: IpfsFileResponse }>;

export function getQuote(path: string, publicKey: Address): Promise<GetQuota>;

export function decryptFile(
  cid: string,
  fileEncryptionKey: string
): Promise<File | ArrayBuffer | any>;

export function textUploadEncrypted(
  text: string,
  apiKey: string,
  publicKey: Address,
  signed_message: string
): Promise<{ data: IpfsFileResponse; isSuccess: boolean; error: ErrorValue }>;

export type API_Key = {
  apiKey: string;
};

export function getApiKey(
  publicKey: Address,
  signedMessage: string
): Promise<{ data: API_Key }>;

export type GetBalance = {
  dataLimit: number;
  dataUsed: number;
};

export function getBalance(publicKey: string): Promise<{ data: GetBalance }>;

export type uploadInfo = {
  publicKey: Address;
  fileName: string;
  mimeType: string;
  txHash: string;
  status: string;
  createdAt: number | string;
  fileSizeInBytes: string;
  cid: string;
  id: string;
  lastUpdate: number;
  encryption: boolean;
};

export function getUploads(
  publicKey: Address,
  pageNo?: number
): Promise<{ data: { upload: uploadInfo[] } }>;

export function createWallet(): Promise<{
  data: {
    encryptedWallet: string;
  };
}>;

export function shareFile(
  publicKey: Address,
  shareTo: Array<Address>,
  cid: string,
  signedMessage: string
): Promise<{
  data: {
    shareTo: Array<Address>;
    cid: string;
  };
  isSuccess: boolean;
}>;

export function getAuthMessage(publicKey: Address): Promise<{
  data: {
    message: string;
  };
}>;

export function getEncryptionKeyPair(
  publicKey: Address,
  accessToken: string
): Promise<{ publicKey: Address; secretKey: string } | null>;

export function revokeFileAccess(
  publicKey: Address,
  revokeTo: Array<Address>,
  cid: string,
  signedMessage: string
): Promise<{
  data: { cid: string; revokeTo: Array<Address> };
  error: ErrorValue;
  isSuccess: boolean;
}>;

export type ChainType = "EVM" | "evm" | "solana" | "SOLANA";

export function accessControl(
  address: string,
  cid: string,
  signedMessage: string,
  conditions: { [key: string]: any },
  aggregator?: string,
  chainType?: ChainType
): Promise<{
  data: {
    cid: string;
    conditions: { [key: string]: any };
    aggregator: string | null;
  };
  isSuccess: boolean;
}>;
