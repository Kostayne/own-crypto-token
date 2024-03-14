export const validateUrl = (val: string): string => {
    if (val === '') {
        return 'Required';
    }

    if (
        !val.match(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
        )
    ) {
        return 'Invalid URL';
    }

    return '';
};