import type { HDAccount } from '@t/hdAccount.type';

export function validateAccountName(val: string, allAccounts: HDAccount[]) {
	if (val.length === 0) {
		return 'Empty name';
	}

	if (val.length > 16) {
		return 'Too long';
	}

	if (allAccounts.some((a) => a.name === val)) {
		return 'Non unique';
	}

	return '';
}
