import type { HDNodeWallet } from "ethers";
import type { HDAccount } from "./hdAccount.type";
import type { BaseContract } from "ethers";

/**
 * @description Describes main hd wallet + its children
 */
export interface WalletState {
    contract?: BaseContract;
    accounts: HDAccount[];
    mainWallet: HDNodeWallet;
    selectedWallet: HDNodeWallet;
}