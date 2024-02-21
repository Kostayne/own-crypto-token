<script lang="ts">
	import { gs } from 'get-module-style';

	export let name = '';
	export let className = '';
	export let color: 'primary' | 'blue' = 'primary';
</script>

<label class="flex flex-col items-center gap-1">
	<button
		on:click
		id={`icon-btn-${name}`}
		class={gs(
			' w-[34px] h-[34px]',
			'rounded-full flex items-center justify-center',
			' transition',

			{
				'bg-primary hover:bg-primary-dark': color === 'primary',
				'bg-blue hover:saturate-150 active:saturate-200': color === 'blue',
			},

			className,
		)}
	>
		<slot />
	</button>

	{#if name}
		<span class="text-[12px] text-center max-w-[60px] font-light mt-1 cursor-pointer">
			{name}
		</span>
	{/if}
</label>
