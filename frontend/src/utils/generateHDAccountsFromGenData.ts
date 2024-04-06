import type { HDNodeWallet } from 'ethers';
import type { HDAccountGenerationData } from '@t/hdAccountGenerationData.type';
import type { HDAccount } from '@t/hdAccount.type';

export function generateHDAccountsFromData(
    wallet: HDNodeWallet,
    genData: HDAccountGenerationData[],
) {
    return genData.map((a) => {
        const childWallet = wallet.deriveChild(a.index);

        return {
            name: a.name,
            wallet: childWallet,
            index: a.index,
        } as HDAccount;
    });
}
