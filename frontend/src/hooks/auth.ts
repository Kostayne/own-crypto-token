import { onMount } from 'svelte';
import { get } from 'svelte/store';
import { goto } from '$app/navigation';

// ctx
import { getGlobalStore } from '@ctx/getGlobalStore';

// utils
import { loadEncryptedDataRaw } from '@utils/encryptedDataStore';
import { loadRecentPassword } from '@utils/tempPasswordStore';

type AuthType = 'init' | 'loggedIn';

export function useAuth(type: AuthType) {
    // global state
	const globalStore = getGlobalStore();

    // hooks
	onMount(() => {
		// redirect to welcome page if data is not stored
		if (!loadEncryptedDataRaw()) {
			goto('/welcome');
			return;
		}

		// redirect to login page if data not decrypted
		if (type === 'loggedIn' && !get(globalStore)) {
			const passwordRes = loadRecentPassword(); {
				if (passwordRes.isError) {
					goto('/login');
					return;
				}
			}
		}
	});
}