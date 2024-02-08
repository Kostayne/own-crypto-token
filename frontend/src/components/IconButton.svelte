<script>
	import { gs } from 'get-module-style';

	export let name = '';
</script>

<div class="flex flex-col items-center gap-1">
	<button
		on:click
		class={gs(
			'bg-primary w-[34px] h-[34px]',
			'rounded-full flex items-center justify-center',
			'hover:bg-primary-dark transition',
		)}
		id={`icon-btn-${name}`}
	>
		<slot />
	</button>

	<label
		for={`icon-btn-${name}`}
		class="text-[12px] text-center max-w-[60px] font-light mt-1 cursor-pointer"
	>
		{name}
	</label>
</div>
