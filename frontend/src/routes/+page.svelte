<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// types
	import type { EstablishConnectionErrT } from '@t/errors/establishConnectionError.type';

	// cfg
	import { tokenName, tokenSymbol } from '../cfg';

	// widgets
	import AccountSelect from './_widgets/AccountSelectWidget.svelte';
	import CreateChildAccountModal from './_widgets/CreateChildAccountModalWidget.svelte';
	import ManageAccountsModal from './_widgets/ManageAccountsModalWidget.svelte';
	import EditAccountsModal from './_widgets/EditChildAccountModalWidget.svelte';

	// components
	import IconButton from '@c/buttons/IconButton.svelte';
	import ConnectionErrorModal from '@c/modals/ConnectionErrorModal.svelte';
	import UserActionsList from './_components/UserActionsList.svelte';
	import AdminActionsList from './_components/AdminActionsList.svelte';

	// icons
	import GearIcon from '@icons/gear.svg?component';

	// store
	import { getGlobalStore, ConnectionActions, ContractActions } from '@stores/globalStore';

	// shared hooks
	import { useAuth } from '@hooks/useAuth';

	// store
	const globalStore = getGlobalStore();

	const connActions = new ConnectionActions(globalStore);
	const contractActions = new ContractActions(globalStore);

	// store.aliases
	const contract = $globalStore?.walletState?.contract;

	// state
	let isShowingAccountManagement = false;
	let isShowingCreateAccount = false;
	let isShowingEditAccount = false;

	let fetchedBalance = false;
	let connectionErr: EstablishConnectionErrT | '' = '';

	// address of account to edit in editAccountModal
	let editingAccAddress = '';

	let selectedAccBalance = BigInt(0);

	// event handlers
	const onChangeAcc = async () => {
		selectedAccBalance = await contractActions.getBalance();
	};

	// hooks
	useAuth('loggedIn');

	onMount(async () => {
		if (!$globalStore?.password) {
			return;
		}

		if (!contract) {
			// establish connection to get a contract instance
			const res = await connActions.establishConnection();

			if (res.isError) {
				// failed to connect, do nothing
				connectionErr = res.unwrapErr();
				return;
			}

			return;
		}

		// fetching balance
		selectedAccBalance = await contractActions.getBalance();
	});

	globalStore.subscribe(async (newData) => {
		// fetch balance if needed
		if (newData?.walletState?.contract && fetchedBalance) {
			selectedAccBalance = await contractActions.getBalance();
			fetchedBalance = true;
		}
	});
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
		on:change={onChangeAcc}
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

	{#if connectionErr}
		<ConnectionErrorModal
			errorType={connectionErr}
			on:close={() => {
				connectionErr = '';
			}}
		/>
	{/if}

	<UserActionsList className="mt-6" />
	<AdminActionsList className="mt-6" />
</main>
