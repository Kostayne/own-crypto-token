import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';

// types
import type { InitData } from '@stores/initStore/initData.type';

export function getInitStore() {
	return getContext<Writable<InitData>>('initData');
}
