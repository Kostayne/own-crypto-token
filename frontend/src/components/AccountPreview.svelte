<script lang="ts">
	import { gs } from 'get-module-style';
	import { createEventDispatcher } from 'svelte';

	// svgs
	import RmSvg from '@icons/rm.svg?component';
	import EditSvg from '@icons/edit.svg?component';

	// c
	import IconButton from './buttons/IconButton.svelte';

	// types
	import type { AccountPreviewData } from '@t/accountPreviewData.type';

	// props
	export let className = '';
	export let data: AccountPreviewData;

	// enables edit & delete btns
	export let manageable = false;

	const dispatch = createEventDispatcher();
</script>

<div class={gs(className, 'flex p-2 bg-[#F8F8F8] rounded-md')}>
	<div class={gs('flex flex-col gap-1')}>
		<span class="text-left text-blue text-[14px] font-medium">{data.name}</span>
		<span class="text-left text-[14px]">{data.address}</span>
	</div>

	{#if manageable}
		<div class="ml-auto flex items-center gap-1">
			<IconButton className="w-5" name="edit" color="blue" on:click={() => dispatch('edit')}>
				<EditSvg />
			</IconButton>

			<IconButton
				strokeOnly
				className="w-5"
				name="remove"
				color="blue"
				on:click={() => dispatch('rm')}
			>
				<RmSvg />
			</IconButton>
		</div>
	{/if}
</div>
