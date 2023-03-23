/* istanbul ignore file */
/* Not in use currently, kept for future use */

import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

export default (passwordEncrypted: string, nonce: string, encryptionPublicKey: string, secretKey: string) => {
  return util.encodeUTF8(
    nacl.box.open(
      util.decodeBase64(passwordEncrypted),
      util.decodeBase64(nonce),
      util.decodeBase64(encryptionPublicKey),
      util.decodeBase64(secretKey),
    ) ?? new Uint8Array(0),
  );
};
