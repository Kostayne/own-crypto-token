<script lang="ts">
	import { gs } from 'get-module-style';
	import { createEventDispatcher, onMount } from 'svelte';

	// types
	type Validator = (value: string) => string;

	// props
	export let name = '';
	export let className = '';
	export let value = '';
	export let placeholder = '';
	export let error: string | boolean = false;
	export let validator: Validator | undefined = undefined;

	const dispatchEvent = createEventDispatcher();

	// computed
	$: resultName = !error ? name : `${name} | ${error}`;

	// event handlers
	function validate() {
		if (!validator) {
			return;
		}

		error = validator(value);
	}

	// hooks
	onMount(() => {
		validate();
	});
</script>

<label class={gs(className, 'flex flex-col')}>
	{#if typeof resultName !== 'undefined'}
		<span class={gs('mb-1 text-[12px] font', { 'text-red-500': error })}>{resultName}</span>
	{/if}

	<input
		bind:value
		{placeholder}
		on:input={() => {
			validate();
			dispatchEvent('change', value);
		}}
		class={gs(
			'border rounded-[3px] p-1',
			`${error ? 'border-red-500 outline-red-500' : 'border-primary outline-primary'}`,
		)}
	/>

	<!-- display error message -->
	<!-- {#if typeof error === 'string' && error !== ''}
		<span class="mt-1 text-[12px] text-red-500">{error}</span>
	{/if} -->
</label>
