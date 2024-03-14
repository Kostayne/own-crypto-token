<script lang="ts">
	import { goto } from '$app/navigation';

	// c
	import Button from '@c/buttons/Button.svelte';
	import IconButton from '@c/buttons/IconButton.svelte';
	import ConnectionInfoCard from '@c/cards/ConnectionInfoCard.svelte';

	// stores
	import { getGlobalStore } from '@stores/globalStore/globalStore.selector';
	import { AuthActions } from '@stores/globalStore/actions/authActions';

	// icons
	import RmSvg from '@icons/rm.svg?component';

	// ctx
	const globalStore = getGlobalStore();
	const authActions = new AuthActions(globalStore);
</script>

<main class="mx-auto max-w-[375px]">
	<!-- Settings X -->
	<div class="flex justify-between items-center">
		<h1 class="text-blue text-xl font-medium">Settings</h1>

		<IconButton
			noBgHover
			color="blue"
			strokeOnly
			on:click={() => {
				goto('/');
			}}
		>
			<RmSvg stroke-width="2.5" width={20} height={20} />
		</IconButton>
	</div>

	<ConnectionInfoCard className="mt-4" />

	<Button
		className="mt-5 mx-auto"
		type="error"
		on:click={() => {
			authActions.logout();
		}}
	>
		Logout
	</Button>
</main>
