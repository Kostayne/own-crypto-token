<script lang="ts">
	import { gs } from 'get-module-style';
	import { createEventDispatcher, onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	// store
	import { ConnectionActions, getGlobalStore } from '@stores/globalStore';

	// types
	import type { AccountPreviewData } from '@t/accountPreviewData.type';
	import type { GlobalStateData } from '@stores/globalStore/globalStateData.type';

	// c
	import TextButton from '@c/buttons/TextButton.svelte';
	import AccountPreview from '../_components/AccountPreview.svelte';

	// svgs
	import ChevronSvg from '@icons/chevron.svg?component';

	// utils
	import { generateAccountPreviews } from '@utils/generateAccountPreviews';

	// store
	const globalStore = getGlobalStore();
	const connActions = new ConnectionActions(globalStore);

	globalStore.subscribe(() => {});

	// props
	export let className = '';

	// state
	const dispatch = createEventDispatcher();

	let containerRef: HTMLButtonElement;
	let isOpened = false;

	// utils
	// need global state for proper reactivity
	const getAccountPreviews = (globalState: GlobalStateData): AccountPreviewData[] => {
		if (!globalState) {
			return [];
		}

		return [
			{
				address: $globalStore.walletState.mainWallet.address,
				name: 'Main account',
			},

			...generateAccountPreviews($globalStore.walletState.accounts),
		] as AccountPreviewData[];
	};

	$: previewsData = getAccountPreviews($globalStore);
	$: selectedAddress = $globalStore?.walletState?.selectedWallet?.address;
	$: selectedAccount = previewsData.find((a) => a.address === selectedAddress) || previewsData[0];
	$: notSelectedAccounts = previewsData.filter((a) => a.address !== selectedAddress);

	// event handlers
	async function onItemSelect(address: string) {
		// getting new wallet by address
		const getNewWallet = () => {
			if (address === $globalStore.walletState.mainWallet.address) {
				return $globalStore.walletState.mainWallet;
			}

			return $globalStore.walletState.accounts.find((a) => a.wallet.address === address)?.wallet;
		};

		const newWallet = getNewWallet();

		if (!newWallet) {
			toast.error('Failed to find selected account!');
			return;
		}

		// setting selected wallet in global store
		$globalStore.walletState.selectedWallet = newWallet;

		// create a new connection that uses new wallet
		await connActions.establishConnection();

		dispatch('change', newWallet.address);
	}

	// hooks
	onMount(() => {
		function onClickOnDocument(e: MouseEvent) {
			if (!e.target) {
				isOpened = false;
				return;
			}

			const tg = e.target as HTMLElement;

			if (tg.contains(containerRef)) {
				isOpened = false;
			}
		}

		document.addEventListener('click', onClickOnDocument);

		return () => {
			document.removeEventListener('click', onClickOnDocument);
		};
	});
</script>

<button
	role="listbox"
	tabindex="0"
	on:click={() => (isOpened = !isOpened)}
	bind:this={containerRef}
	class={gs(className, 'flex flex-col cursor-pointer')}
>
	<!-- horizontal -->
	<div
		class={gs(
			'flex items-center w-full p-2',
			'group bg-whiteContrast hover:bg-gray-200 transition gap-x-2 rounded-md',
		)}
	>
		{#if !selectedAccount}
			<span class={gs('text-gray-600 text-[14px] font-light')}>No account selected</span>

			<ChevronSvg class="ml-auto stroke-blue" />
		{/if}

		<!-- selected option -->
		{#if selectedAccount}
			<AccountPreview className="!p-0 group-hover:bg-gray-200 transition" data={selectedAccount} />

			<ChevronSvg class="ml-auto stroke-blue" />
		{/if}
	</div>

	<!-- options list -->
	<div class="relative w-full">
		{#if isOpened}
			<div
				class={gs(
					'absolute left-[-40px] right-[-40px] top-3',
					'flex flex-col gap-3',
					'p-4 bg-white rounded-b-sm shadow-md',
				)}
			>
				<!-- options -->
				{#each notSelectedAccounts as acc}
					<button on:click={() => onItemSelect(acc.address)}>
						<AccountPreview className={gs('hover:bg-gray-200 transition')} data={acc} />
					</button>
				{/each}

				<!-- manage accounts btn -->
				<TextButton
					type="alternative"
					className={gs('font-medium text-[14px] py-2 bg-whiteContrast')}
					on:click={() => dispatch('clickManage')}
				>
					Manage accounts
				</TextButton>
			</div>
		{/if}
	</div>

	<!-- TODO copy address btn -->
</button>
