import type { AccountPreviewData } from "@t/accountPreviewData.type";
import type { HDAccount } from "@t/hdAccount.type";

export function generateAccountPreviews(accounts: HDAccount[]): AccountPreviewData[] {
    return accounts.map(a => {
        return {
            address: a.wallet.address,
            name: a.name,
        };
    });
}