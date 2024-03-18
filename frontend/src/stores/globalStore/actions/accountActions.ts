import { get } from "svelte/store";

// types
import type { HDAccount } from "@t/hdAccount.type";

// actions
import { GlobalStoreActions } from "../globalStoreActions";

// utils
import { saveEncryptedData } from "@utils/encryptedDataStore";

export type CreateAccountErr = 'NOT_AUTHORIZED'| 'FAILED_TO_SAVE';

export class AccountActions extends GlobalStoreActions {
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

	editAccount(address: string, newName: string) {
		// forking global state
		const globalState = { ...get(this.store) };

		// getting acc to edit
		const stateAcc = globalState.walletState.accounts.find(a => a.wallet.address === address);

		if (!stateAcc) {
			throw new Error('Could not find account to edit in state!');
		}

		const encryptedAcc = globalState.encrypted.accounts.find(a => stateAcc.index === a.index);
		
		if (!encryptedAcc) {
			throw new Error('Could not find account to edit in encrypted data!');
		}

		// changing name
		stateAcc.name = newName;
		encryptedAcc.name = newName;

		// saving changes
		saveEncryptedData(globalState.encrypted, globalState.password);
		this.store.set(globalState);
	}

	deleteAccount(address: string) {
		// forking global state
		const globalState = { ...get(this.store) };

		// getting acc to delete
		const accToDel = globalState.walletState.accounts.find(a => a.wallet.address === address);

		// nothing to delete
		if (!accToDel) {
			return;
		}

		// checking if user tries to delete main wallet
		if (accToDel.index === 0) {
			throw new Error('Can not delete account with index 0!');
		}

		// selecting main acc if current selected account deleted
		if (globalState.walletState.selectedWallet.address === address) {
			globalState.walletState.selectedWallet = globalState.walletState.mainWallet;
		}

		// deleting acc from wallet state
		globalState.walletState.accounts = globalState.walletState.accounts.filter(a => a.wallet.address !== address);

		// deleting acc from encrypted data
		globalState.encrypted.accounts = globalState.encrypted.accounts.filter(a => a.index !== accToDel.index);

		// saving data to the browser
		saveEncryptedData(globalState.encrypted, globalState.password);

		// saving new global state
		this.store.set(globalState);
	}
}