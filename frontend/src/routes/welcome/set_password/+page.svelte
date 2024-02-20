<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';

	// c
	import Input from '@c/Input.svelte';
	import Button from '@c/buttons/Button.svelte';

	// types
	import { HDNodeWallet } from 'ethers';
	import type { Writable } from 'svelte/store';
	import type { InitData } from '@t/initData.type';
	import type { EncryptedData } from '@t/encryptedData.type';

	// utils
	import { validatePassword, validatePasswordConfirm } from '@utils/passwordValidator';
	import { saveEncryptedData } from '@utils/seedPhraseStore';

	// state
	let password = '';
	let passwordErr = '';
	let confirm = '';
	let confirmErr = '';

	const initData = getContext<Writable<InitData>>('initData');
	const wallet = getContext<Writable<HDNodeWallet>>('wallet');

	// event listeners
	async function onSetPasswordClick() {
		// validation check
		if (passwordErr || confirmErr) {
			return;
		}

		// if some how we not have seed phrase redirect user
		if (!$initData.seedPhrase) {
			goto('/welcome');
			return;
		}

		// saving password
		$initData = { ...$initData, password };

		try {
			// generating an hd wallet from seed phrase
			const seedPhrase = $initData.seedPhrase as string;
			wallet.set(HDNodeWallet.fromPhrase(seedPhrase));

			// setting encrypted data
			const data: EncryptedData = {
				childAccounts: [],
				seedPhrase: $initData.seedPhrase as string,

				connectionData: {
					type: 'API',
				},
			};

			saveEncryptedData(data, password);

			// redirect to home
			goto('/');
		} catch (e) {
			console.error(e);
			alert('Failed to encrypt your seed with a password, details in console.');
			return;
		}
	}

	// hooks
	onMount(() => {
		// seed phrase must be already set, otherwise redirect user
		if (!$initData.seedPhrase) {
			goto('/welcome');
		}

		passwordErr = validatePassword('');
		confirmErr = validatePasswordConfirm('', '');
	});
</script>

<svelte:head>
	<title>Set Kreepto pass</title>
</svelte:head>

<main class="mx-auto max-w-[280px] flex flex-col">
	<p class="text-center">Create a password that will secure your seed phrase</p>

	<Input
		type="password"
		error={passwordErr}
		className="mt-6"
		value={password}
		label="Password"
		autocomplete="new-password"
		on:change={(e) => {
			password = e.detail;
			passwordErr = validatePassword(e.detail);

			// have to revalidate confirm, since it depends on password
			confirmErr = validatePasswordConfirm(confirm, password);
		}}
	/>

	<Input
		type="password"
		error={confirmErr}
		className="mt-3"
		value={confirm}
		label="Repeat password"
		autocomplete="new-password"
		on:change={(e) => {
			confirm = e.detail;
			confirmErr = validatePasswordConfirm(e.detail, password);
		}}
	/>

	<Button disabled={!!(confirmErr || passwordErr)} on:click={onSetPasswordClick} className="mt-4">
		Continue
	</Button>
</main>
