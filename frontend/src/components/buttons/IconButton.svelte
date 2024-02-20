<script lang="ts">
	import { gs } from 'get-module-style';
	import styles from './IconButton.module.scss';

	// props
	type colorType = 'blue' | 'green';

	export let name = '';
	export let className = '';
	export let disabled = false;
	export let color: colorType = 'green';

	// if all svg is a stroke we need to set stroke color
	export let strokeOnly = false;
	// disables fill color on hover
	export let noFill = false;
</script>

<button
	on:click
	{disabled}
	{name}
	class={gs(
		className,
		'flex items-center justify-center rounded-md aspect-square',
		'transition hover:saturate-[1.5] disabled:saturate-[0.85]',
		strokeOnly ? styles.btn_stroke : '',
		noFill ? '' : styles.fill,

		{
			'hover:bg-blue hover:saturate-[0.5] fill-blue': color === 'blue',
			'hover:bg-primary fill-primary': color === 'green',

			'stroke-blue hover:*:stroke-awhite': strokeOnly && color == 'blue',
			'stroke-primary hover:*:stroke-awhite': strokeOnly && color == 'green',
		},
	)}
>
	<slot />
</button>
