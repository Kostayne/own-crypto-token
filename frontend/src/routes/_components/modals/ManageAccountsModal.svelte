<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	// c
	import Modal from '@c/Modal.svelte';
	import AccountPreview from '@c/AccountPreview.svelte';
	import Button from '@c/buttons/Button.svelte';
	import CreateAccountButton from '../buttons/CreateAccountButton.svelte';

	// utils
	import { generateAccountPreviews } from '@utils/generateAccountPreviews';

	// ctx
	import { getGlobalStore } from '@ctx/getGlobalStore';
	import { GlobalStoreActions } from '@stores/globalStore/globalStoreActions';

	// global state
	const globalStore = getGlobalStore();
	const globalActions = new GlobalStoreActions(globalStore);
	const unsubscribeFromGlobalStore = globalStore.subscribe(() => {});

	const dispatch = createEventDispatcher();

	// computed
	$: previews = generateAccountPreviews($globalStore.walletState?.accounts || []);

	// hooks
	onMount(() => {
		return () => {
			unsubscribeFromGlobalStore();
		};
	});
</script>

<Modal on:close formClassName="w-[300px]" title="Accounts">
	<div class="flex flex-col gap-y-2 w-full">
		{#each previews as p}
			<AccountPreview
				data={p}
				manageable
				className="w-full"
				on:rm={() => globalActions.deleteAccount(p.address)}
			/>
		{/each}
	</div>

	<!-- no accounts text -->
	{#if previews.length === 0}
		<p class="text-center pb-5">There is no child accounts, <br /> click plus to generate one</p>
	{/if}

	<CreateAccountButton
		className="mt-3 mr-auto"
		on:click={() => {
			dispatch('createAccount');
		}}
	/>

	<Button
		className="mt-4 w-full"
		on:click={() => {
			dispatch('close');
		}}
	>
		OK
	</Button>
</Modal>
