import type { EncryptedData } from "./encryptedData.type";
import type { WalletState } from "./walletState.type";

export interface GlobalStateData {
    encrypted: EncryptedData;
    walletState: WalletState;

    password: string;
}