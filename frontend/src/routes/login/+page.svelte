<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';
	import { HDNodeWallet } from 'ethers';

	// c
	import Button from '@c/Button.svelte';
	import Input from '@c/Input.svelte';
	import WelcomeText from '@c/WelcomeText.svelte';

	// types
	import type { Writable } from 'svelte/store';
	import type { EncryptedData } from '@t/encryptedData.type';

	// utils
	import { loadEncryptedDataRaw, loadEncryptedData } from '@utils/seedPhraseStore';
	import { validatePassword } from '@utils/passwordValidator';

	// state
	let password = '';
	let passwordErr = '';

	// global state
	const walletStore = getContext<Writable<HDNodeWallet>>('wallet');
	const encryptedStore = getContext<Writable<EncryptedData>>('encrypted');

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

		// redir to welcome if no secret phrase stored
		if (!loadEncryptedDataRaw) {
			goto('/welcome');
			return;
		}

		// loading encrypted data
		let encryptedData: EncryptedData;

		try {
			encryptedData = loadEncryptedData(password);
			encryptedStore.set(encryptedData);
		} catch (e) {
			passwordErr = 'Invalid password';
			return;
		}

		// setting a wallet
		try {
			const seedPhrase = encryptedData.seedPhrase as string;
			walletStore.set(HDNodeWallet.fromPhrase(seedPhrase));
		} catch (e) {
			console.error(e);
			alert('Loaded seed phrase is invalid!');
			return;
		}

		// redir to home
		goto('/');
	}
</script>

<WelcomeText />

<main class="mx-auto max-w-[280px] flex flex-col items-stretch">
	<p class="mt-5 text-center">Unlock the wallet with your password</p>

	<Input
		autocomplete="current-password"
		type="password"
		className="mt-6"
		label="Password"
		value={password}
		error={passwordErr}
		on:change={(e) => {
			password = e.detail;
			passwordErr = validatePassword(e.detail);
		}}
	/>

	<Button on:click={onLoginClick} className="mt-3" disabled={!!passwordErr}>Login</Button>
</main>
