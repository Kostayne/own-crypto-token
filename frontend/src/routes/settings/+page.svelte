<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// c
	import Button from '@c/buttons/Button.svelte';
	import IconButton from '@c/buttons/IconButton.svelte';
	import ConnectionInfoCard from '@c/cards/ConnectionInfoCard.svelte';

	// stores
	import { getGlobalStore, AuthActions } from '@stores/globalStore';

	// icons
	import RmSvg from '@icons/rm.svg?component';

	// shared hooks
	import { useAuth } from '@hooks/useAuth';

	// ctx
	const globalStore = getGlobalStore();
	const authActions = new AuthActions(globalStore);

	let isConnectionCardOpened = false;

	// hooks
	useAuth('loggedIn', '/settings');

	onMount(() => {
		console.log($page.url.searchParams);
		if ($page.url.searchParams.get('connection')) {
			isConnectionCardOpened = true;
		}
	});
</script>

<svelte:head>
	<title>Kreepto settings</title>
</svelte:head>

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

	<ConnectionInfoCard isOpened={isConnectionCardOpened} isCollapsible className="mt-4" />

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
