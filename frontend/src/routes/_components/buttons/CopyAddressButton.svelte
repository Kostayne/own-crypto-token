<script lang="ts">
	import { gs } from 'get-module-style';
	import toast from 'svelte-french-toast';

	// icons
	import CopyIcon from '@icons/copy.svg?component';

	// props
	export let className = '';
	export let address = '';

	// event handlers
	const onClick = () => {
		navigator.clipboard.writeText(address);
		toast.success('Copied the address to clipboard', {
			position: 'top-right',
		});
	};
</script>

<button
	class={gs(
		className,
		'flex items-center stroke-blue transition',
		'hover:saturate-150 active:saturate-200',
	)}
	on:click={onClick}
>
	<CopyIcon class="aspect-square" />

	<span class="ml-2 text-blue">Copy address</span>
</button>
