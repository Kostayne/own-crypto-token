<script lang="ts">
	import { gs } from 'get-module-style';
	import { slide } from 'svelte/transition';
	import collapse from 'svelte-collapse';

	// components
	import IconButton from './buttons/IconButton.svelte';

	// icons
	import ChevronIcon from '@icons/chevron.svg?component';

	// props
	export let className = '';
	export let headClassName = '';
	export let contentClassName = '';

	// state
	export let isOpened = false;
</script>

<div transition:slide={{ duration: 0.2 }} class={gs(className)}>
	<div class={gs('flex items-center justify-between', headClassName)}>
		<slot name="head" />

		<IconButton
			noFill
			noBgHover
			strokeOnly
			className="p-1 group"
			on:click={() => (isOpened = !isOpened)}
		>
			<ChevronIcon
				stroke-width="2"
				class={gs('group-hover:stroke-white transition-transform', isOpened ? 'rotate-180' : '')}
			/>
		</IconButton>
	</div>

	<div use:collapse={{ open: isOpened }} class={gs(contentClassName)}>
		<slot />
	</div>
</div>
