export type IpfsFileResponse = {
  Name: string;
  Hash: string;
  Size: string | number;
};
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

export function uploadText(text, apiKey): Promise<{ data: IpfsFileResponse }>;

export function uploadEncrypted(
  sourcePath: string,
  apiKey: string,
  publicKey: string,
  signed_message: string
): Promise<{ data: IpfsFileResponse }>;

export function getQuote(path: string, publicKey: string): Promise<GetQuota>;

export function decryptFile(
  cid: string,
  fileEncryptionKey: string
): Promise<File | ArrayBuffer | any>;

export function textUploadEncrypted(
  text: string,
  apiKey: string,
  publicKey: string,
  signed_message: string
): Promise<{ data: IpfsFileResponse; isSaved: boolean; error: ErrorValue }>;
