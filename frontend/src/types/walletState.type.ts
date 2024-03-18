import type { HDNodeWallet } from "ethers";
import type { HDAccount } from "./hdAccount.type";
import type { AppContract } from "./appContract.type";

/**
 * @description Describes main hd wallet + its children
 */
export interface WalletState {
    contract?: AppContract;
    accounts: HDAccount[];
    mainWallet: HDNodeWallet;
    selectedWallet: HDNodeWallet;
}