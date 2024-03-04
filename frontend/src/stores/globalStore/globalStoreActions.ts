import type { Writable } from "svelte/store";

// types
import type { GlobalStateData } from "./globalStateData.type";

export abstract class GlobalStoreActions {
    constructor(
        protected store: Writable<GlobalStateData>
    ) {}
}