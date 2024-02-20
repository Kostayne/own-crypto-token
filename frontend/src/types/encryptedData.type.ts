import type { ConnectionData } from "./connectionData.type";
import type { HDAccountData } from "./hdAccountData.type";

export interface EncryptedData {
    seedPhrase: string;
    childAccounts: HDAccountData[];
    connectionData: ConnectionData;
}