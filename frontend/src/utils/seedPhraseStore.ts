import CryptoJS from "crypto-js";

const key = 'kreepto_wallet_encrypted';

export function saveSeedPhrase(seedPhrase: string, password: string) {
    const encrypted = CryptoJS.AES.encrypt(seedPhrase, password).toString();
    localStorage.setItem(key, encrypted);;
}

export function loadRawSeedPhrase() {
    return localStorage.getItem(key);
}

export function loadSeedPhrase(password: string) {
    const encrypted = localStorage.getItem(key);

    if (!encrypted) {
        return undefined;
    }

    const decrypted = CryptoJS.AES.decrypt(encrypted, password);
    return decrypted.toString(CryptoJS.enc.Utf8);
}