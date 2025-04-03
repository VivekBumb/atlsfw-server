import { privateKeyPem } from '../password.mjs';
import forge from 'node-forge';
import { publicKeyPem } from '../password.mjs';

/*
 * This function accepts a string and returns an encrypted string
 */
export function encryptWithPublicKey(message) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(message, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
            md: forge.md.sha1.create()
        }
    });
    return forge.util.encode64(encrypted);
}

export function decryptWithPrivateKey(encryptedMessage) {
    // Convert the PEM-formatted private key to a private key object
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    

    // Decode the base64-encoded encrypted message
    const encryptedBuffer = forge.util.decode64(encryptedMessage);

    // Decrypt the buffer using the private key
    const decrypted = privateKey.decrypt(encryptedBuffer, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
            md: forge.md.sha1.create()
        }
    });

    return decrypted;
}

export default decryptWithPrivateKey;