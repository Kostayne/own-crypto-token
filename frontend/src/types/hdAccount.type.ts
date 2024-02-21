import type { HDNodeWallet } from "ethers";

export interface HDAccount {
    name: string;
    index: number;
    wallet: HDNodeWallet;
}