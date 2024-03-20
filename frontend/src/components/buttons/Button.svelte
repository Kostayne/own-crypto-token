<script lang="ts">
	import { onMount } from 'svelte';
	import { gs } from 'get-module-style';
	import { Clock } from 'svelte-loading-spinners';

	type ButtonType = 'primary' | 'secondary' | 'alternative' | 'warning' | 'error';

	export let type: ButtonType = 'primary';
	export let className = '';
	export let disableTime = 0;
	export let disabled = disableTime > 0;

	onMount(() => {
		// disable button for some time if needed
		if (disableTime > 0) {
			const i = setInterval(() => {
				disableTime -= 1;

				if (disableTime <= 0) {
					clearInterval(i);
				}
			}, 1000);

			const t = setTimeout(() => {
				disabled = false;
			}, disableTime);

			return () => {
				clearInterval(i);
				clearTimeout(t);
			};
		}
	});
</script>

<button
	on:click
	disabled={disabled || disableTime > 0}
	class={gs(
		className,

		`flex justify-center items-center gap-x-2`,
		`py-[8px] px-4 rounded-[4px] text-awhite`,
		'font-semibold text-[14px] transition',
		'hover:saturate-[1.5] disabled:saturate-[0.85]',
		'relative max-w-[280px]',

		{
			'bg-blue': type === 'alternative',
			'bg-primary disabled:bg-primary-dark': type === 'primary',
			'bg-primary-dark': type === 'secondary',
			'bg-btn-warning': type === 'warning',
			'bg-btn-danger': type === 'error',
		},
	)}
>
	<slot />

	{#if disableTime > 0}
		<div class="absolute left-2 flex items-center gap-x-1">
			<Clock size={16} color="white" />
			<span>{disableTime}s</span>
		</div>
	{/if}
</button>
