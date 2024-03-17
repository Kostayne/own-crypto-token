<script lang="ts">
	import { gs } from 'get-module-style';

	// c
	import Card from '@c/Card.svelte';
	import Collapsible from '@c/Collapsible.svelte';
	import ConnectionInfoForm from '@c/forms/ConnectionInfoForm.svelte';

	// props
	export let className = '';
	export let isCollapsible = true;

	// state
	let isOpened = false;
</script>

<Card className={gs(className)}>
	{#if isCollapsible}
		<Collapsible bind:isOpened className="w-full">
			<span slot="head">Connection settings</span>

			<ConnectionInfoForm
				className="mt-4"
				on:connectionSuccess={() => {
					isOpened = false;
				}}
				on:cancel={() => {
					isOpened = false;
				}}
			/>
		</Collapsible>
	{/if}

	{#if !isCollapsible}
		<div class={'w-full'}>
			<span class="text-primary font-medium">Connection settings</span>

			<ConnectionInfoForm className="mt-4" hideCancelButton />
		</div>
	{/if}
</Card>
