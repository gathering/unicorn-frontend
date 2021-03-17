export const parseError = (error: any) => {
    const { body } = error;

    if (Array.isArray(body)) {
        // TODO Do something useful with error
        return error;
    } else if (typeof body === 'object') {
        return Object.entries(body).map(([key, err]) => {
            const description = key === 'detail' ? '' : key + ': ';

            if (Array.isArray(err)) {
                return description + err.join('. ');
            }

            return description + err;
        });
    } else {
        return [body];
    }
};
