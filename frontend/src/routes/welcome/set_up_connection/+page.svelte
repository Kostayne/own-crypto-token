<script lang="ts">
	import { goto } from '$app/navigation';

	// c
	import ConnectionInfoCard from '@c/cards/ConnectionInfoCard.svelte';

	// hooks
	import { useAuth } from '@hooks/useAuth';

	// types
	import { type EstablishConnectionErrT } from '@t/errors/establishConnectionError.type';

	// using hooks
	useAuth('loggedIn', '/welcome/set_up_connection');
</script>

<svelte:head>
	<title>Set up a connection</title>
</svelte:head>

<main class="flex flex-col w-full">
	<span class="w-fit mx-auto text-center">
		You have created a wallet! <br /> To use it set up a connection
	</span>

	<ConnectionInfoCard
		className="mt-4"
		isCollapsible={false}
		on:connectionSuccess={() => goto('/')}
	/>
</main>
