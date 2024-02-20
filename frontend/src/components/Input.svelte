<script lang="ts">
	import { gs } from 'get-module-style';
	import { createEventDispatcher, onMount } from 'svelte';

	// types
	type Validator = (value: string) => string;

	// props
	export let label = '';
	export let className = '';
	export let value = '';
	export let placeholder = '';
	export let type: 'text' | 'password' = 'text';
	export let error: string | boolean = false;
	export let name = label;
	export let autocomplete = '';

	export let validator: Validator | undefined = undefined;

	const dispatchEvent = createEventDispatcher();

	// computed
	$: resultName = !error ? label : `${label} | ${error}`;

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
		{autocomplete}
		{...{ type }}
		{name}
		on:input={() => {
			validate();
			dispatchEvent('change', value);
		}}
		class={gs(
			'border rounded-[3px] p-1',
			`${error ? 'border-red-500 outline-red-500' : 'border-primary outline-primary'}`,
		)}
	/>
</label>
