import { get } from "svelte/store";

// actions
import { GlobalStoreActions } from "../globalStoreActions";

export class ContractActions extends GlobalStoreActions {
    private contract = get(this.store).walletState?.contract;

    async getBalance(): Promise<number> {
        // TODO implement getBalance logic
        // this.contract.

        return 0;
    }
}