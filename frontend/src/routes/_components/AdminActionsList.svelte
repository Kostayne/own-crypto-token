<script>
	import { gs } from 'get-module-style';
	import toast from 'svelte-french-toast';

	// c
	import AddToWhiteListButton from './buttons/AddToWhiteListButton.svelte';
	import RmFromWhiteListButton from './buttons/RmFromWhiteListButton.svelte';
	import AddAdminButton from './buttons/AddAdminButton.svelte';
	import RmAdminButton from './buttons/RmAdminButton.svelte';
	import PauseButton from './buttons/PauseButton.svelte';
	import ContinueButton from './buttons/ContinueButton.svelte';
	import EmitButton from './buttons/EmitButton.svelte';
	import BurnButton from './buttons/BurnButton.svelte';
	import ChangeOwnerButton from './buttons/ChangeOwnerButton.svelte';

	// stores
	import { ContractActions, getGlobalStore } from '@stores/globalStore';

	// widgets
	import EmitModalWidget from '../_widgets/modals/EmitModalWidget.svelte';
	import BurnModalWidget from '../_widgets/modals/BurnModalWidget.svelte';
	import AddToWhiteListModalWidget from '../_widgets/modals/AddToWhiteListModalWidget.svelte';
	import RmFromWhiteListModalWidget from '../_widgets/modals/RmFromWhiteListModalWidget.svelte';
	import AddAdminModalWidget from '../_widgets/modals/AddAdminModalWidget.svelte';
	import RmAdminModalWidget from '../_widgets/modals/RmAdminModalWidget.svelte';
	import ChangeOwnerModalWidget from '../_widgets/modals/ChangeOwnerModalWidget.svelte';

	// props
	export let className = '';

	// store
	const globalStore = getGlobalStore();
	const actions = new ContractActions(globalStore);

	// state
	let isShowingMintModal = false;
	let isShowingBurnModal = false;
	let isShowingAddAdmin = false;
	let isShowingRmAdmin = false;
	let isShowingAddToWhiteListModal = false;
	let isShowingRmFromWhiteListModal = false;
	let isShowingChangeOwnerModal = false;

	// event handlers
	const onPauseClick = async () => {
		const res = await actions.pause();

		if (res.isError) {
			console.error(res.unwrapErr());
			toast.error(res.unwrapErr().shortMessage);
			return;
		}

		toast.success('Paused all transactions', {
			position: 'top-center',
		});
	};

	const onUnpauseClick = async () => {
		const res = await actions.unpause();

		if (res.isError) {
			console.error(res.unwrapErr());
			toast.error(res.unwrapErr().shortMessage);
			return;
		}

		toast.success('Unpaused all transactions', {
			position: 'top-center',
		});
	};
</script>

<div class={gs(className, 'max-w-[250px] mx-auto flex flex-wrap justify-center gap-x-3 gap-y-3')}>
	<!-- Buttons -->
	<AddToWhiteListButton on:click={() => (isShowingAddToWhiteListModal = true)} />
	<RmFromWhiteListButton on:click={() => (isShowingRmFromWhiteListModal = true)} />

	<AddAdminButton on:click={() => (isShowingAddAdmin = true)} />
	<RmAdminButton on:click={() => (isShowingRmAdmin = true)} />

	<PauseButton on:click={onPauseClick} />
	<ContinueButton on:click={onUnpauseClick} />

	<EmitButton on:click={() => (isShowingMintModal = true)} />
	<BurnButton on:click={() => (isShowingBurnModal = true)} />

	<ChangeOwnerButton on:click={() => (isShowingChangeOwnerModal = true)} />

	<!-- Modals -->
	<!-- Emit / burn -->
	{#if isShowingMintModal}
		<EmitModalWidget on:close={() => (isShowingMintModal = false)} />
	{/if}

	{#if isShowingBurnModal}
		<BurnModalWidget on:close={() => (isShowingBurnModal = false)} />
	{/if}

	<!-- white list -->
	{#if isShowingAddToWhiteListModal}
		<AddToWhiteListModalWidget on:close={() => (isShowingAddToWhiteListModal = false)} />
	{/if}

	{#if isShowingRmFromWhiteListModal}
		<RmFromWhiteListModalWidget on:close={() => (isShowingRmFromWhiteListModal = false)} />
	{/if}

	<!-- Admins -->
	{#if isShowingAddAdmin}
		<AddAdminModalWidget on:close={() => (isShowingAddAdmin = false)} />
	{/if}

	{#if isShowingRmAdmin}
		<RmAdminModalWidget on:close={() => (isShowingRmAdmin = false)} />
	{/if}

	<!-- Change owner -->
	{#if isShowingChangeOwnerModal}
		<ChangeOwnerModalWidget on:close={() => (isShowingChangeOwnerModal = false)} />
	{/if}
</div>
