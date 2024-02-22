<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// types
	import type { AccountPreviewData } from '@t/accountPreviewData.type';
	import type { GlobalStateData } from '@t/globalStateData.type';

	// cfg
	import { tokenName, tokenSymbol } from '../cfg';

	// components
	import UserActionsList from './_components/UserActionsList.svelte';
	import AdminActionsList from './_components/AdminActionsList.svelte';
	import ManageAccountsModal from './_components/modals/ManageAccountsModal.svelte';
	import AccountSelect from './_components/AccountSelect.svelte';
	import CreateChildAccountModal from './_components/modals/CreateChildAccountModal.svelte';

	// utils
	import { loadEncryptedDataRaw } from '@utils/encryptedDataStore';
	import { generateAccountPreviews } from '@utils/generateAccountPreviews';

	// ctx
	import { getGlobalStore } from '@ctx/getGlobalStore';

	// global state
	const globalStore = getGlobalStore();

	const unsubscribeFromGlobalState = globalStore.subscribe((newGlobalState) => {
		// handling sign out
		if (!newGlobalState) {
			goto('/login');
			return;
		}
	});

	// helpers
	const getAccountPreviews = (globalState: GlobalStateData): AccountPreviewData[] => {
		if (!globalState) {
			return [];
		}

		return [
			{
				address: globalState.walletState.mainWallet.address,
				name: 'Main account',
			},

			...generateAccountPreviews(globalState.walletState.accounts),
		] as AccountPreviewData[];
	};

	// let local state
	let isShowingAccountManagement = false;
	let isShowingCreateAccount = false;

	// hooks
	onMount(() => {
		// redirect to welcome page if data is not stored
		if (!loadEncryptedDataRaw()) {
			goto('/welcome');
			return;
		}

		// redirect to login page if data not decrypted
		if (!$globalStore) {
			goto('/login');
			return;
		}

		// clear
		return () => {
			unsubscribeFromGlobalState();
		};
	});

	// computed
	$: accountPreviews = getAccountPreviews($globalStore);
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
		selectedAddress={$globalStore?.walletState?.selectedWallet?.address}
		previewsData={accountPreviews}
		className="mt-1"
	/>

	{#if isShowingAccountManagement}
		<ManageAccountsModal
			on:close={() => {
				isShowingAccountManagement = false;
			}}
			on:createAccount={() => {
				isShowingCreateAccount = true;
			}}
		/>
	{/if}

	{#if isShowingCreateAccount}
		<CreateChildAccountModal
			on:close={() => {
				isShowingAccountManagement = true;
				isShowingCreateAccount = false;
			}}
		/>
	{/if}

	<UserActionsList className="mt-6" />
	<AdminActionsList className="mt-6" />
</main>
