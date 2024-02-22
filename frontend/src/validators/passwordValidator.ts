export function validatePassword(val: string): string {
    if (val.length < 8) {
        return 'Min length 8';
    }

    if (val.length > 16) {
        return 'Max length 16';
    }

    return '';
}

export function validatePasswordConfirm(val: string, password: string) {
    const errors: string[] = [];
    const baseErr = validatePassword(val);

    if (baseErr) {
        errors.push(baseErr);
    }

    if (password !== val) {
        errors.push('Passwords not match');
    }

    return errors.join(', ');
}