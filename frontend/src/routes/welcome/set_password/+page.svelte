<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { HDNodeWallet } from 'ethers';

	// c
	import Input from '@c/Input.svelte';
	import Button from '@c/buttons/Button.svelte';

	// utils
	import { validatePassword, validatePasswordConfirm } from '@utils/passwordValidator';
	import { saveEncryptedData } from '@utils/encryptedDataStore';

	// ctx
	import { getInitStore } from '@ctx/getInitStore';
	import { getGlobalStore } from '@ctx/getGlobalStore';

	// state
	let password = '';
	let passwordErr = '';
	let confirm = '';
	let confirmErr = '';

	const initDataStore = getInitStore();
	const globalStore = getGlobalStore();

	// event listeners
	async function onSetPasswordClick() {
		// validation check
		if (passwordErr || confirmErr) {
			return;
		}

		// if some how we not have seed phrase redirect user
		if (!$initDataStore.seedPhrase) {
			goto('/welcome');
			return;
		}

		// saving password
		$initDataStore = { ...$initDataStore, password };

		// generating an hd wallet from seed phrase
		// and setting global wallet state
		try {
			const seedPhrase = $initDataStore.seedPhrase as string;
			const wallet = HDNodeWallet.fromPhrase(seedPhrase);

			const globalState = { ...$globalStore };

			// setting wallet sate
			globalState.walletState = {
				accounts: [],
				mainWallet: wallet,
				selectedWallet: wallet,
			};

			// setting encrypted data
			globalState.encrypted = {
				accounts: [],
				seedPhrase: $initDataStore.seedPhrase as string,

				connectionData: {
					type: 'API',
				},
			};

			// setting new global state
			globalStore.set(globalState);

			// saving encrypted data to browser
			saveEncryptedData(globalState.encrypted, password);

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
		if (!$initDataStore.seedPhrase) {
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
