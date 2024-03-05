import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';

// ctx
import { getGlobalStore } from '@ctx/getGlobalStore';
import { AuthActions } from '@stores/globalStore/authActions';

// utils
import { loadEncryptedDataRaw } from '@utils/encryptedDataStore';
import { loadPasswordByTemporary } from '@utils/userPasswordStore';

type AuthType = 'init' | 'loggedIn';

export function useAuth(type: AuthType) {
    // global state
	const globalStore = getGlobalStore();

    // hooks
	onMount(() => {
		// redirect to welcome if user is not registered
		if (!loadEncryptedDataRaw()) {
			goto('/welcome');
			return;
		}

		// user don't have to to be logged in, so no more checks
		if (type !== 'loggedIn') {
			return;
		}

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