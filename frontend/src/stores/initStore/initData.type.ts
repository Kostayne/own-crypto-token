import type { ConnectionData } from "@t/connectionData.type";

export interface InitData {
    password?: string;
    seedPhrase?: string;
    connectionSettings?: ConnectionData;
}