<script lang="ts">
	import { gs } from 'get-module-style';

	export let className = '';
	export let type: 'primary' | 'secondary' | 'warning' | 'error' = 'primary';
</script>

<button
	on:click
	class={gs(className, 'hover:saturate-[1.5]', {
		'text-primary': type === 'primary',
		'text-primary-dark': type === 'secondary',
		'text-btn-warning': type === 'warning',
		'text-btn-danger': type === 'error',
	})}
>
	<slot />
</button>
