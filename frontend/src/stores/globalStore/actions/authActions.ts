import { goto } from '$app/navigation';
import { HDNodeWallet } from 'ethers/wallet';
import { get, type Writable } from 'svelte/store';
import { Err, Ok, toResult, type Result } from 'base-ts-result';
import toast from 'svelte-french-toast';

// class
import { GlobalStoreActions } from '../globalStoreActions';

// utils
import { savePassword } from '@utils/userPasswordStore';
import { generateHDAccountsFromData } from '@utils/generateHDAccountsFromGenData';
import {
    deleteEncryptedData,
    loadEncryptedData,
    loadEncryptedDataRaw,
    saveEncryptedData,
} from '@utils/encryptedDataStore';

// types
import type { GlobalStateData } from '../globalStateData.type';
import type { EncryptedData } from '@t/encryptedData.type';
import type { InitData } from '@stores/initStore/initData.type';

type LoginError = 'INVALID_PASSWORD' | 'INVALID_SEED' | 'NOT_REGISTERED';
type RegisterError = 'INVALID_SEED' | 'FAILED_TO_SAVE' | 'NO_SEED_PHRASE';

const revalidateTempPassInterval = NaN;

export class AuthActions extends GlobalStoreActions {
    login(password: string, destPath = '/'): Result<void, LoginError> {
        // redir to welcome if no secret phrase stored
        if (!loadEncryptedDataRaw()) {
            goto('/welcome');
            return Err('NOT_REGISTERED');
        }

        const globalState = {} as GlobalStateData;

        // loading encrypted data
        const encryptedDataRes = toResult(() => loadEncryptedData(password));
        {
            if (encryptedDataRes.isError) {
                return Err('INVALID_PASSWORD');
            }
        }

        const encryptedData = encryptedDataRes.unwrap() as EncryptedData;

        globalState.password = password;
        globalState.encrypted = encryptedData;

        // setting wallet state
        try {
            const seedPhrase = encryptedData.seedPhrase as string;
            const mainWallet = HDNodeWallet.fromPhrase(seedPhrase);
            const accounts = generateHDAccountsFromData(mainWallet, encryptedData.accounts);

            globalState.walletState = {
                accounts,
                mainWallet,
                selectedWallet: mainWallet,
            };
        } catch (e) {
            toast.error('Loaded seed phrase is invalid!');
            return Err('INVALID_SEED');
        }

        // checking if we already revalidating temp password
        if (!isNaN(revalidateTempPassInterval)) {
            clearInterval(revalidateTempPassInterval);
        }

        // starting new revalidation cycle
        setInterval(
            () => {
                savePassword(globalState.password);
            },
            1000 * 60 * 3,
        );

        savePassword(globalState.password);

        this.store.set(globalState);
        goto(destPath);

        return Ok(undefined);
    }

    register(initDataStore: Writable<InitData>, password: string): Result<void, RegisterError> {
        // if some how we not have seed phrase redirect user
        if (!get(initDataStore).seedPhrase) {
            goto('/welcome');
            return Err('NO_SEED_PHRASE');
        }

        // saving password
        initDataStore.set({ ...get(initDataStore), password });

        // generating an hd wallet from seed phrase
        // and setting global wallet state
        const seedPhrase = get(initDataStore).seedPhrase as string;

        const walletRes = toResult(() => HDNodeWallet.fromPhrase(seedPhrase));
        {
            if (walletRes.isError) {
                return Err('INVALID_SEED');
            }
        }

        const wallet = walletRes.unwrap();
        const globalState = { ...get(this.store), password };

        // setting wallet state
        globalState.walletState = {
            accounts: [],
            mainWallet: wallet,
            selectedWallet: wallet,
        };

        // setting encrypted data
        globalState.encrypted = {
            accounts: [],
            seedPhrase: get(initDataStore).seedPhrase as string,

            connectionData: {
                type: 'api',
            },
        };

        // setting new global state
        this.store.set(globalState);

        // saving encrypted data to browser
        const saveRes = toResult(() => saveEncryptedData(globalState.encrypted, password));
        {
            if (saveRes.isError) {
                console.error(saveRes.unwrapErr());
                return Err('FAILED_TO_SAVE');
            }
        }

        goto('/welcome/set_up_connection');
        return Ok(undefined);
    }

    logout() {
        // delete global state
        deleteEncryptedData();
        this.store.set(undefined as unknown as GlobalStateData);
        goto('/welcome');
    }
}
