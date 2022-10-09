const { Crypto } = require("@peculiar/webcrypto");

const crypto = new Crypto();

const importKeyFromBytes = async (keyBytes) =>
  crypto.subtle.importKey("raw", keyBytes, "PBKDF2", false, ["deriveKey"]);

const deriveKey = async (sourceKey, keyUsage, keyDerivationParams) =>
  crypto.subtle.deriveKey(
    keyDerivationParams,
    sourceKey,
    { name: "AES-GCM", length: 256 },
    false,
    keyUsage
  );

const encryptFile = async (fileArrayBuffer, password) => {
  try {
    const plainTextBytes = new Uint8Array(fileArrayBuffer);
    const passwordBytes = new TextEncoder().encode(password);

    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const passwordKey = await importKeyFromBytes(passwordBytes);

    const aesKey = await deriveKey(passwordKey, ["encrypt"], {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000,
      hash: "SHA-256",
    });
    const cipherBytes = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      plainTextBytes
    );

    const cipherBytesArray = new Uint8Array(cipherBytes);
    const resultBytes = new Uint8Array(
      cipherBytesArray.byteLength + salt.byteLength + iv.byteLength
    );
    resultBytes.set(salt, 0);
    resultBytes.set(iv, salt.byteLength);
    resultBytes.set(cipherBytesArray, salt.byteLength + iv.byteLength);

    return resultBytes;
  } catch (error) {
    console.error("Error encrypting file");
    console.error(error);
    throw error;
  }
};

const decryptFile = async (cipher, password) => {
  try {
    const cipherBytes = new Uint8Array(cipher);
    const passwordBytes = new TextEncoder().encode(password);

    const salt = cipherBytes.slice(0, 16);
    const iv = cipherBytes.slice(16, 16 + 12);
    const data = cipherBytes.slice(16 + 12);
    const passwordKey = await importKeyFromBytes(passwordBytes);
    const aesKey = await deriveKey(passwordKey, ["decrypt"], {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000,
      hash: "SHA-256",
    });

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      data
    );

    return decryptedContent;
  } catch (error) {
    console.error("Error decrypting file");
    console.error(error);
    return;
  }
};

module.exports = { encryptFile, decryptFile };