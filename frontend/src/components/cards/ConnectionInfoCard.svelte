<script lang="ts">
	import { gs } from 'get-module-style';

	// c
	import Card from '@c/Card.svelte';
	import Collapsible from '@c/Collapsible.svelte';
	import ConnectionInfoForm from '@c/forms/ConnectionInfoForm.svelte';

	// props
	export let className = '';

	// state
	let isOpened = false;
</script>

<Card className={gs('', className)}>
	<Collapsible bind:isOpened className="w-full">
		<span slot="head">Connection settings</span>

		<ConnectionInfoForm
			className="mt-4"
			on:save={() => {
				isOpened = false;
			}}
			on:cancel={() => {
				isOpened = false;
			}}
		/>
	</Collapsible>
</Card>
