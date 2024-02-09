<script>
	import { gs } from 'get-module-style';

	export let name = '';
</script>

<label class="flex flex-col items-center gap-1">
	<button
		on:click
		id={`icon-btn-${name}`}
		class={gs(
			'bg-primary w-[34px] h-[34px]',
			'rounded-full flex items-center justify-center',
			'hover:bg-primary-dark transition',
		)}
	>
		<slot />
	</button>

	<span class="text-[12px] text-center max-w-[60px] font-light mt-1 cursor-pointer">
		{name}
	</span>
</label>
