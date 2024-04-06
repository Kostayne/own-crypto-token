import type { HDAccount } from '@t/hdAccount.type';

export function validateAccountIndex(val: string, allAccounts: HDAccount[]): string {
	const parsed = parseInt(val);

	if (isNaN(parsed)) {
		return 'Only numbers allowed';
	}

	if (parsed <= 0) {
		return 'Negative or zero value';
	}

	if (allAccounts.some((a) => a.index === parsed)) {
		return 'The index already taken';
	}

	return '';
}
