<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';
	import { HDNodeWallet, Wallet } from 'ethers';

	// c
	import Button from '@c/Button.svelte';
	import Input from '@c/Input.svelte';
	import WelcomeText from '@c/WelcomeText.svelte';

	// types
	import type { Writable } from 'svelte/store';

	// utils
	import { loadRawSeedPhrase, loadSeedPhrase } from '@utils/seedPhraseStore';
	import { validatePassword } from '@utils/passwordValidator';

	// state
	let password = '';
	let passwordErr = '';

	let wallet = getContext<Writable<HDNodeWallet>>('wallet');

	// hooks
	onMount(() => {
		// return to welcome if there is no seed phrase
		if (!loadRawSeedPhrase()) {
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
		if (!loadRawSeedPhrase) {
			goto('/welcome');
			return;
		}

		// loading seed phrase
		const seedPhrase = loadSeedPhrase(password);

		// generating a wallet
		try {
			wallet.set(Wallet.fromPhrase(seedPhrase as string));
		} catch (e) {
			passwordErr = 'Invalid password';
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
