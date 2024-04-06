export function validateTransferValue(val: string): string {
	const num = parseInt(val);

	if (isNaN(num)) {
		return 'Not a number';
	}

	if (num <= 0) {
		return 'Should be positive';
	}

	return '';
}
