<script lang="ts">
	import { gs } from 'get-module-style';
	import { createEventDispatcher } from 'svelte';

	// types
	import type { AccountPreviewData } from '@t/accountPreviewData.type';
	import AccountPreview from './AccountPreview.svelte';

	// props
	export let className = '';
	export let previewsData: AccountPreviewData[] = [];

	// state
	const dispatch = createEventDispatcher();
</script>

<div class={gs('flex flex-col gap-2', className)}>
	{#each previewsData as p}
		<AccountPreview data={p} manageable />
	{/each}
</div>
