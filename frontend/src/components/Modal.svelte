<script lang="ts">
	import { gs } from 'get-module-style';

	export let title = '';
	export let className = '';
	export let formClassName = '';
	export let type: 'primary' | 'warning' | 'error' = 'primary';
</script>

<!-- wrapper -->
<div
	class={gs(
		className,
		'fixed left-0 top-0 w-full h-full',
		'flex justify-center p-4 z-[3] backdrop-blur-sm',
	)}
>
	<!-- form -->
	<div
		class={gs(
			'max-w-[500px] h-fit rounded-[8px] p-4 bg-white',
			'flex items-center flex-col shadow-md',
			formClassName,
		)}
	>
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
	</div>
</div>
