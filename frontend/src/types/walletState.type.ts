import type { HDNodeWallet } from "ethers";
import type { HDAccount } from "./hdAccount.type";

/**
 * @description Describes main hd wallet + its children
 */
export interface WalletState {
    mainWallet: HDNodeWallet;
    accounts: HDAccount[];

    selectedWallet: HDNodeWallet;
}