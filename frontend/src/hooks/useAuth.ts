import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';

// ctx
import { getGlobalStore } from '@stores/globalStore/globalStore.selector';
import { AuthActions } from '@stores/globalStore/actions/authActions';
import { getInitStore } from '@stores/initStore/initStore.selector';

// utils
import { loadEncryptedDataRaw } from '@utils/encryptedDataStore';
import { loadPasswordByTemporary } from '@utils/userPasswordStore';

/**
 * @init ensures that user generated a wallet seed, 
 * @registered ensures that user set password with a seed
 * @loggedIn ensures that all account info is loaded into state
 */
type AuthType = 'init' | 'registered' | 'loggedIn';

export function useAuth(type: AuthType) {
    // global state
	const globalStore = getGlobalStore();
	const initStore = getInitStore();

    // hooks
	onMount(() => {
		// page requires basic init account state
		// =======================================
		if (type === 'init') {
			// no init state, redirect to welcome page
			if (!get(initStore)?.seedPhrase) {
				goto('/welcome');
				return;
			}

			// all ok, ret
			return;
		}

		// page requires to be registered
		// ==============================
		const encryptedData = loadEncryptedDataRaw(); {
			// there is not account data, redirect to welcome
			if (!encryptedData) {
				goto('/welcome');
				return;
			}

			// user is already registered & not must be le logged in
			if (type === 'registered') {
				return;
			}
		}
		
		// page requires to be logged in		
		// =============================

		// already authenticated, not redirecting
		if (get(globalStore)?.encrypted) {
			return;
		}

		// not logged in, trying tempPassword
		const passwordRes = loadPasswordByTemporary(); {
			// temp password failed, redirecting
			if (passwordRes.isError) {
				goto('/login');
				return;
			}
		}

		const actions = new AuthActions(globalStore);
		actions.login(passwordRes.unwrap());
	});
}