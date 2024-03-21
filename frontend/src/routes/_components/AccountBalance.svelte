<script lang="ts">
	import { gs } from 'get-module-style';

	// src
	import { tokenSymbol } from '@src/cfg';

	// props
	export let className = '';
	export let balance: bigint;
</script>

<span class={gs('block font-semibold text-primary text-[23px]', className)}>
	{balance}
	{tokenSymbol}
</span>
