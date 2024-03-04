<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { HDNodeWallet } from 'ethers';

	// c
	import Button from '@c/buttons/Button.svelte';
	import Input from '@c/Input.svelte';
	import WelcomeText from '@c/WelcomeText.svelte';

	// types
	import type { EncryptedData } from '@t/encryptedData.type';
	import type { GlobalStateData } from '@stores/globalStore/globalStateData.type';

	// validators
	import { validatePassword } from '@validators/passwordValidator';

	// utils
	import { loadEncryptedDataRaw, loadEncryptedData } from '@utils/encryptedDataStore';
	import { generateHDAccountsFromData } from '@utils/generateHDAccountsFromGenData';

	// ctx
	import { getGlobalStore } from '@ctx/getGlobalStore';
	import { AuthActions } from '@stores/globalStore/authActions';

	// state
	let password = '';
	let passwordErr = '';

	// global state
	const globalStore = getGlobalStore();
	const authActions = new AuthActions(globalStore);

	// hooks
	onMount(() => {
		// return to welcome if there is no seed phrase
		if (!loadEncryptedDataRaw()) {
			goto('/welcome');
			return;
		}

		passwordErr = validatePassword('');
	});

	// event handlers
	async function onLoginClick() {
		// just an additional validation check (more safe)
		if (passwordErr) {
			return;
		}

		const res = authActions.login(password);
		{
			if (res.isError && res.unwrapErr() === 'INVALID_PASSWORD') {
				passwordErr = 'Invalid password';
			}
		}
	}
</script>

<WelcomeText />

<main class="mx-auto max-w-[280px] flex flex-col items-stretch">
	<p class="mt-5 text-center">Unlock the wallet with your password</p>

	<Input
		type="password"
		className="mt-6"
		label="Password"
		value={password}
		error={passwordErr}
		autocomplete="current-password"
		on:change={(e) => {
			password = e.detail;
			passwordErr = validatePassword(e.detail);
		}}
	/>

	<Button on:click={onLoginClick} className="mt-3" disabled={!!passwordErr}>Login</Button>
</main>
