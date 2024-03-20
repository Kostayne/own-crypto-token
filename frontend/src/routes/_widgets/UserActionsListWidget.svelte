<script>
	import { gs } from 'get-module-style';

	// c
	import TransferFromButton from '../_components/buttons/TransferFromButton.svelte';
	import TransferButton from '../_components/buttons/TransferButton.svelte';
	import AllowToButton from '../_components/buttons/AllowToButton.svelte';
	import AllowanceButton from '../_components/buttons/AllowanceButton.svelte';
	import BalanceOfButton from '../_components/buttons/BalanceOfButton.svelte';
	import BalanceOfModalWidget from './modals/BalanceOfModalWidget.svelte';
	import TransferToModalWidget from './modals/TransferToModalWidget.svelte';

	// props
	export let className = '';

	// state
	let isShowingBalanceOf = false;
	let isShowingTransferTo = false;
</script>

<div class={gs(className, 'max-w-[230px] mx-auto flex flex-wrap justify-center gap-x-3 gap-y-3')}>
	<TransferButton on:click={() => (isShowingTransferTo = true)} />
	<TransferFromButton />
	<AllowToButton />
	<AllowanceButton />
	<BalanceOfButton on:click={() => (isShowingBalanceOf = true)} />

	{#if isShowingTransferTo}
		<TransferToModalWidget on:close={() => (isShowingTransferTo = false)} />
	{/if}

	{#if isShowingBalanceOf}
		<BalanceOfModalWidget on:close={() => (isShowingBalanceOf = false)} />
	{/if}
</div>
