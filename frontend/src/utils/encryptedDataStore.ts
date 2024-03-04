import type { EncryptedData } from "@t/encryptedData.type";
import CryptoJS from "crypto-js";

const key = 'kreepto_wallet_encrypted';

export function saveEncryptedData(data: EncryptedData, password: string) {
    const json = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(json, password).toString();
    localStorage.setItem(key, encrypted);;
}

export function loadEncryptedDataRaw() {
    return localStorage.getItem(key);
}

export function loadEncryptedData(password: string): EncryptedData | undefined {
    const encrypted = localStorage.getItem(key);

    if (!encrypted) {
        return undefined;
    }

    const decrypted = CryptoJS.AES.decrypt(encrypted, password);
    const decryptedJson = decrypted.toString(CryptoJS.enc.Utf8);

    return JSON.parse(decryptedJson);
}