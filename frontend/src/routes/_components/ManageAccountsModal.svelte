<script lang="ts">
	import { createEventDispatcher, getContext, onMount } from 'svelte';
	import { type Writable } from 'svelte/store';

	// c
	import Modal from '@c/Modal.svelte';
	import AccountPreview from '@c/AccountPreview.svelte';
	import CreateAccountButton from './buttons/CreateAccountButton.svelte';
	import Button from '@c/buttons/Button.svelte';

	// types
	import type { WalletState } from '@t/walletState.type';

	// utils
	import { generateAccountPreviews } from '@utils/generateAccountPreviews';

	// global state
	const walletStateStore = getContext<Writable<WalletState>>('walletState');
	const unsubscribeFromWalletState = walletStateStore.subscribe(() => {});

	const dispatch = createEventDispatcher();

	// computed
	$: previews = generateAccountPreviews($walletStateStore?.accounts || []);

	// hooks
	onMount(() => {
		return () => {
			unsubscribeFromWalletState();
		};
	});
</script>

<Modal on:close formClassName="w-[300px]" title="Accounts">
	<div class="flex flex-col gap-y-2 w-full">
		{#each previews as p}
			<AccountPreview className="w-full" data={p} manageable />
		{/each}
	</div>

	<!-- no accounts text -->
	{#if previews.length === 0}
		<p class="text-center pb-5">There is no child accounts, <br /> click plus to generate one</p>
	{/if}

	<CreateAccountButton className="mt-3 mr-auto" />

	<Button
		className="mt-4 w-full"
		on:click={() => {
			dispatch('close');
		}}
	>
		OK
	</Button>
</Modal>
