<script>
	// c
	import ConnectionInfoCard from '@c/cards/ConnectionInfoCard.svelte';

	// hooks
	import { useAuth } from '@hooks/useAuth';

	useAuth('loggedIn', '/welcome/set_up_connection');
</script>

<svelte:head>
	<title>Set up a connection</title>
</svelte:head>

<main class="flex flex-col w-full">
	<span class="w-fit mx-auto">Set up a connection settings</span>

	<ConnectionInfoCard isCollapsible={false} className="mt-4" />
</main>
