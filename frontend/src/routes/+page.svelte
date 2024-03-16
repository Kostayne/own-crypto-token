<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// types
	import type { AccountPreviewData } from '@t/accountPreviewData.type';
	import type { GlobalStateData } from '@stores/globalStore/globalStateData.type';

	// cfg
	import { tokenName, tokenSymbol } from '../cfg';

	// components
	import IconButton from '@c/buttons/IconButton.svelte';
	import UserActionsList from './_components/UserActionsList.svelte';
	import AdminActionsList from './_components/AdminActionsList.svelte';
	import AccountSelect from './_components/AccountSelect.svelte';
	import CreateChildAccountModal from './_components/modals/CreateChildAccountModal.svelte';
	import ManageAccountsModal from './_components/modals/ManageAccountsModal.svelte';
	import EditAccountsModal from './_components/modals/EditChildAccountModal.svelte';

	// icons
	import GearIcon from '@icons/gear.svg?component';

	// utils
	import { generateAccountPreviews } from '@utils/generateAccountPreviews';

	// ctx
	import { getGlobalStore } from '@stores/globalStore/globalStore.selector';
	import { ConnectionActions } from '@stores/globalStore/actions/connectionActions';

	// shared hooks
	import { useAuth } from '@hooks/useAuth';

	// store
	const globalStore = getGlobalStore();
	globalStore.subscribe(() => {});

	const connActions = new ConnectionActions(globalStore);

	// aliases
	const contract = $globalStore?.walletState?.contract;
	const selectedWallet = $globalStore?.walletState?.selectedWallet;

	// hooks
	useAuth('loggedIn');

	onMount(() => {
		if (!$globalStore?.password) {
			return;
		}

		if (!contract) {
			connActions.establishConnection();
		}
	});

	// state
	let isShowingAccountManagement = false;
	let isShowingCreateAccount = false;
	let isShowingEditAccount = false;

	// address of account to edit in editAccountModal
	let editingAccAddress = '';

	let selectedAccBalance = 0;

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

	// computed
	$: accountPreviews = getAccountPreviews($globalStore);
</script>

<svelte:head>
	<title>Kreepto wallet</title>
</svelte:head>

<main class="relative flex flex-col items-center">
	<IconButton
		color="green"
		className="p-1 absolute left-0 top-0 select-none"
		on:click={() => {
			goto('/settings');
		}}
	>
		<GearIcon />
	</IconButton>

	<span class="font-medium">{tokenName}</span>
	<span class="font-medium text-[0.8rem]">Total supply: 500KST</span>

	<span class="mt-6 text-[23px] font-semibold text-primary">
		{selectedAccBalance}

		{tokenSymbol}
	</span>

	<AccountSelect
		className="mt-1"
		previewsData={accountPreviews}
		selectedAddress={selectedWallet?.address}
		on:clickManage={() => {
			isShowingAccountManagement = true;
		}}
	/>

	{#if isShowingAccountManagement}
		<ManageAccountsModal
			on:close={() => {
				isShowingAccountManagement = false;
			}}
			on:createAccount={() => {
				isShowingCreateAccount = true;
			}}
			on:editAccount={(e) => {
				editingAccAddress = e.detail;
				isShowingEditAccount = true;
			}}
		/>
	{/if}

	{#if isShowingCreateAccount}
		<CreateChildAccountModal
			on:close={() => {
				isShowingCreateAccount = false;
				isShowingAccountManagement = true;
			}}
		/>
	{/if}

	{#if isShowingEditAccount}
		<EditAccountsModal
			address={editingAccAddress}
			on:close={() => {
				isShowingEditAccount = false;
				isShowingAccountManagement = true;
			}}
		/>
	{/if}

	<UserActionsList className="mt-6" />
	<AdminActionsList className="mt-6" />
</main>
