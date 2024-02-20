<script lang="ts">
	import { gs } from 'get-module-style';
	import { createEventDispatcher } from 'svelte';

	// types
	import type { AccountPreviewData } from '@t/accountPreviewData.type';

	// c
	import AccountPreview from '@c/AccountPreview.svelte';

	// svgs
	import ChevronSvg from '@icons/chevron.svg?component';
	import TextButton from '@c/buttons/TextButton.svelte';

	// props
	export let className = '';
	export let previewsData: AccountPreviewData[] = [];
	export let selectedAddress: string = previewsData[0]?.address || '';

	// state
	const dispatch = createEventDispatcher();

	let isOpened = false;

	$: selectedAccount = previewsData.find((a) => a.address === selectedAddress) || previewsData[0];
	$: notSelectedAccounts = previewsData.filter((a) => a.address !== selectedAddress);

	// event handlers
	function onItemSelect(address: string) {
		selectedAddress = address;
		dispatch('onChange', selectedAddress);
	}
</script>

<button
	on:click={() => (isOpened = !isOpened)}
	role="listbox"
	tabindex="0"
	class={gs(className, 'flex flex-col bg-whiteContrast cursor-pointer')}
>
	<!-- horizontal -->
	<div
		class={gs(
			'flex items-center w-full p-2',
			'group hover:bg-gray-200 transition gap-x-2 rounded-md',
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
					'absolute left-0 right-0 top-3',
					'flex flex-col gap-2',
					'bg-white pb-2 rounded-b-sm',
				)}
			>
				<!-- options -->
				{#each notSelectedAccounts as acc}
					<button on:click={() => onItemSelect(acc.address)}>
						<AccountPreview className={gs('hover:bg-gray-200 transition')} data={acc} manageable />
					</button>
				{/each}

				<!-- manage accounts btn -->
				<TextButton
					type="alternative"
					className={gs('font-medium text-[14px]')}
					on:click={() => dispatch('clickedManage')}
				>
					Manage accounts
				</TextButton>
			</div>
		{/if}
	</div>
</button>
