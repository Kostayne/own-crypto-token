<script lang="ts">
	import { gs } from 'get-module-style';

	export let className = '';
	export let addresses: string[] = [];
</script>

<div class={gs(className, `grid grid-cols-2 xsm2:grid-cols-3`, `gap-x-4 gap-y-2 justify-between`)}>
	{#each addresses as address, i}
		<div class="text-[14px]">
			<span class="font-semibold">{i + 1}.</span>
			<span class="ml-1">{address}</span>
		</div>
	{/each}
</div>
