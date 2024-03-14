<script lang="ts">
	import { gs } from 'get-module-style';
	import { createEventDispatcher } from 'svelte';

	// c
	import Card from './Card.svelte';

	export let title = '';
	export let className = '';
	export let formClassName = '';
	export let type: 'primary' | 'warning' | 'error' = 'primary';

	const dispatch = createEventDispatcher();
</script>

<!-- wrapper -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class={gs(
		className,
		'fixed left-0 top-0 w-full h-full',
		'flex justify-center p-4 z-[3] backdrop-blur-sm',
	)}
	on:click|self={() => dispatch('close')}
>
	<!-- form -->
	<Card className={gs('max-w-[500px] h-fit', formClassName)}>
		<span
			class={gs(
				{
					'text-primary': type === 'primary',
					'text-btn-warning': type === 'warning',
					'text-btn-danger': type === 'error',
				},

				'font-semibold text-[16px]',
			)}
		>
			{title}
		</span>

		<!-- content -->
		<div class="mt-3 w-full">
			<slot />
		</div>
	</Card>
</div>
