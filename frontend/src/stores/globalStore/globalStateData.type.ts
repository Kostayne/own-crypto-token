import type { EncryptedData } from "@t/encryptedData.type";
import type { WalletState } from "@t/walletState.type";

export interface GlobalStateData {
    encrypted: EncryptedData;
    walletState: WalletState;
    password: string;
}