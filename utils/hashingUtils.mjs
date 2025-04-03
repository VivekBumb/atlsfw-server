import * as Crypto from 'expo-crypto';

async function hashString(data) {
    const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        data
    );
    return hash;
}


export default hashString;


