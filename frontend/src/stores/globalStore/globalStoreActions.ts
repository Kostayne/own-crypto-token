import { get, type Writable } from "svelte/store";

// types
import type { HDAccount } from "@t/hdAccount.type";
import type { GlobalStateData } from "./globalStateData.type";

// utils
import { saveEncryptedData } from "@utils/encryptedDataStore";

export type CreateAccountErr = 'NOT_AUTHORIZED'| 'FAILED_TO_SAVE';

export class GlobalStoreActions {
    constructor(
        protected store: Writable<GlobalStateData>
    ) {}

    createAccount({ index, name, wallet }: HDAccount): CreateAccountErr | undefined {
        if (!this.store) {
            return 'NOT_AUTHORIZED';
		}

		const globalState = { ...get(this.store) };

		// adding new account into encrypted data
		globalState.encrypted.accounts.push({
			name,
			index,
		});

		// adding new account into wallet state
		globalState.walletState.accounts.push({
			name,
			index,
			wallet,
		});

		// setting global state
		this.store.set(globalState);

		// saving changes in browser
		try {
			saveEncryptedData(globalState.encrypted, globalState.password);
		} catch (e) {
            return 'FAILED_TO_SAVE';
		}
    }
}