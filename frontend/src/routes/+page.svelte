<script lang="ts">
	import { goto } from '$app/navigation';
	import { getContext, onMount } from 'svelte';

	// types
	import type { Writable } from 'svelte/store';
	import type { EncryptedData } from '@t/encryptedData.type';
	import type { WalletState } from '@t/walletState.type';
	import type { AccountPreviewData } from '@t/accountPreviewData.type';

	// cfg
	import { tokenName, tokenSymbol } from '../cfg';

	// components
	import UserActionsList from './_components/UserActionsList.svelte';
	import AdminActionsList from './_components/AdminActionsList.svelte';

	// utils
	import { loadEncryptedDataRaw } from '@utils/encryptedDataStore';
	import AccountSelect from './_components/AccountSelect.svelte';
	import { generateAccountPreviews } from '@utils/generateAccountPreviews';
	import ManageAccountsModal from './_components/ManageAccountsModal.svelte';

	// global state
	const walletStateStore = getContext<Writable<WalletState>>('walletState');
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

	// helpers
	const getAccountPreviews = (): AccountPreviewData[] => {
		if (!$walletStateStore) {
			return [];
		}

		return [
			{
				address: $walletStateStore.mainWallet.address,
				name: 'Main account',
			},

			...generateAccountPreviews($walletStateStore.accounts),
		] as AccountPreviewData[];
	};

	// let local state
	let isShowingAccountManagement = false;

	// hooks
	onMount(() => {
		// redirect to welcome page if data is not stored
		if (!loadEncryptedDataRaw()) {
			goto('/welcome');
			return;
		}

		// redirect to login page if data not decrypted
		if (!$encryptedStore || !$walletStateStore) {
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

	<AccountSelect
		on:clickManage={() => {
			isShowingAccountManagement = true;
		}}
		selectedAddress={$walletStateStore?.selectedWallet?.address}
		previewsData={getAccountPreviews()}
		className="mt-1"
	/>

	{#if isShowingAccountManagement}
		<ManageAccountsModal
			on:close={() => {
				isShowingAccountManagement = false;
			}}
		/>
	{/if}

	<UserActionsList className="mt-6" />
	<AdminActionsList className="mt-6" />
</main>
