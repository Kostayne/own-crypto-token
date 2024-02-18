import type { ConnectionData } from "./connectionData.type";
import type { HDAccount } from "./hdAccount.type";

export interface EncryptedData {
    seedPhrase: string;
    childAccounts: HDAccount[];
    connectionData: ConnectionData;
}