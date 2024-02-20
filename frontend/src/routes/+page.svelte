<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';
	import Select from 'svelte-select';

	// types
	import type { Writable } from 'svelte/store';
	import type { EncryptedData } from '@t/encryptedData.type';

	// cfg
	import { tokenName, tokenSymbol } from '../cfg';

	// components
	import UserActionsList from './_components/UserActionsList.svelte';
	import AdminActionsList from './_components/AdminActionsList.svelte';

	// utils
	import { loadEncryptedDataRaw } from '@utils/seedPhraseStore';
	import type { HDNodeWallet } from 'ethers';
	import AccountSelect from './_components/AccountSelect.svelte';

	// state
	// TODO load addresses
	const addresses: string[] = ['0x0123456789', '0x123456789', '0x23456789', '0x3456789'];

	// global state
	const walletStore = getContext<Writable<HDNodeWallet>>('wallet');
	const encryptedStore = getContext<Writable<EncryptedData>>('encrypted');

	const unsubscribeFromEncryptedData = encryptedStore.subscribe((updatedData) => {
		// handling sign out
		if (!updatedData) {
			goto('/login');
			return;
		}
	});

	const unsubscribeFromWallet = encryptedStore.subscribe((updWallet) => {
		// handling sign out
		if (!updWallet) {
			goto('/login');
			return;
		}
	});

	// hooks
	onMount(() => {
		// redirect to welcome page if data is not stored
		if (!loadEncryptedDataRaw()) {
			goto('/welcome');
			return;
		}

		// redirect to login page if data not decrypted
		if (!$encryptedStore || !$walletStore) {
			console.log(`encrypted`, $encryptedStore);
			console.log(`wallet`, $walletStore);
			goto('/login');
			return;
		}

		// clear
		return () => {
			unsubscribeFromWallet();
			unsubscribeFromEncryptedData();
		};
	});
</script>

<svelte:head>
	<title>Kreepto wallet</title>
</svelte:head>

<main class="flex flex-col items-center">
	<span class="font-medium">{tokenName}</span>
	<span class="font-medium text-[0.8rem]">Total supply: 500KST</span>

	<!-- TODO load user balance -->
	<span class="mt-6 text-[23px] font-semibold text-primary">500 {tokenSymbol}</span>

	<!-- TODO address selector -->
	<AccountSelect className="mt-1" />

	<!-- user actions -->
	<UserActionsList className="mt-6" />

	<!-- admin actions -->
	<AdminActionsList className="mt-6" />
</main>
