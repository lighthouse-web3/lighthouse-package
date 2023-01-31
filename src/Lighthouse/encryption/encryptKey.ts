/* istanbul ignore file */
/* Not in use currently, kept for future use */

import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

export default (fileEncryptionKey: string, encryptionPublicKey: string, secretKey: string) => {
  const nonce = nacl.randomBytes(24);
  return {
    encryptedFileEncryptionKey: util.encodeBase64(
      nacl.box(
        util.decodeUTF8(fileEncryptionKey),
        nonce,
        util.decodeBase64(encryptionPublicKey),
        util.decodeBase64(secretKey),
      ),
    ),
    nonce: util.encodeBase64(nonce),
  };
};
