import CryptoJS from 'crypto-js';
import { toResult, type Result, Err, Ok } from 'base-ts-result';

const tempPasswordPrefix = '27Wg8H80_fL';
const localStorageKey = 'k-wallet-tmp';

type LoadTempPasswordErr = 'TIMEOUT' | 'ACCESS_DENIED';

/**
 * @description returns user password used in 3 minutes before
 */
export function loadPasswordByTemporary(): Result<string, LoadTempPasswordErr> {
    // loading encrypted password from local storage
    const encryptedPasswordRes = toResult(() => localStorage.getItem(localStorageKey));

    if (encryptedPasswordRes.isError) {
        // there is no access to local storage
        return Err<LoadTempPasswordErr>('ACCESS_DENIED');
    }

    const encryptedPass = encryptedPasswordRes.unwrap(); {
        // encrypted pass is not stored
        if (!encryptedPass) {
            return Err<LoadTempPasswordErr>('TIMEOUT');
        }
    }

    // trying to decrypt a password
    const tempPassword = getTempPassword();

    const passDecryptionRes = toResult(() => CryptoJS.AES.decrypt(encryptedPass, tempPassword)); {
        // too big timestamp, can't decrypt
        if (passDecryptionRes.isError) {
            // clear data & return an err
            localStorage.setItem(localStorageKey, '');
            return Err<LoadTempPasswordErr>('TIMEOUT');
        }
    }

    const resStr = passDecryptionRes.unwrap().toString(CryptoJS.enc.Utf8);

    if (resStr === '') {
        return Err<LoadTempPasswordErr>('TIMEOUT');
    }

    return Ok(resStr);
}

/**
 * @param password user password
 * @returns error message | undefined
 */
export function savePassword(password: string): string | undefined {
    const tempPassword = getTempPassword();

    const encryptRes = toResult<string, Error>(() => {
        return CryptoJS.AES.encrypt(password, tempPassword).toString();
    });

    if (encryptRes.isError) {
        console.error(encryptRes.unwrapErr());
        return 'Failed to encrypt';
    }

    const saveRes = toResult<void, Error>(() => {
        localStorage.setItem(localStorageKey, encryptRes.unwrap());
    });

    if (saveRes.isError) {
        return 'Failed to write to localStorage';
    }

    return undefined;
}

function getTempPassword(): string {
    const time = getRoundedTime();
    return tempPasswordPrefix + time.toString();
}

function getRoundedTime(): number {
    const time = new Date().getTime();
    return Math.floor(time / (1000 * 60 * 3));
}