export function validateRequiredStr(val: string): string {
	if (val === '') {
		return 'Required';
	}

	return '';
}
