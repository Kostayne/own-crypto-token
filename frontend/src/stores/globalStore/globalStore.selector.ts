import { getContext } from "svelte";
import type { Writable } from "svelte/store";

// types
import type { GlobalStateData } from "@stores/globalStore/globalStateData.type";

export function getGlobalStore() {
    return getContext<Writable<GlobalStateData>>('globalState');
}