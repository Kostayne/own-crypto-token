import { getContext } from "svelte";
import type { Writable } from "svelte/store";

// types
import type { GlobalStateData } from "@t/globalStateData.type";

export function getGlobalStore() {
    return getContext<Writable<GlobalStateData>>('globalState');
}