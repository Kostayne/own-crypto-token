<script lang="ts">
	import Select from 'svelte-select';

	// cfg
	import { tokenName, tokenSymbol } from '../cfg';

	// components
	import UserActionsList from './_components/UserActionsList.svelte';
	import AdminActionsList from './_components/AdminActionsList.svelte';

	const addresses: string[] = ['0x0123456789', '0x123456789', '0x23456789', '0x3456789'];
</script>

<svelte:head>
	<title>Kreepto wallet</title>
</svelte:head>

<main class="flex flex-col items-center">
	<span class="font-medium">{tokenName}</span>
	<span class="font-medium text-[0.8rem]">Total supply: 500KST</span>

	<!-- TODO load user balance -->
	<span class="mt-6 text-[23px] font-semibold text-primary">500 {tokenSymbol}</span>

	<!-- TODO address selector -->
	<div class="mt-1">
		<Select
			placeholder="Select an address"
			value={addresses[0]}
			items={addresses}
			clearable={false}
			showChevron={true}
			searchable={false}
			class="max-w-[200px]"
		/>
	</div>

	<!-- user actions -->
	<UserActionsList className="mt-6" />

	<!-- admin actions -->
	<AdminActionsList className="mt-6" />
</main>
