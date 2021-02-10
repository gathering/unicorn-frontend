export const formatNumber = (number: number, space = false) => {
    const ending = numberEnding(number);

    if (space && ending) {
        return `${number} ${ending}`;
    }

    return number + ending;
};

const numberEnding = (number: number) => {
    switch (number.toString().split('').pop()) {
        case '0':
            return '';

        case '1':
            return 'st';

        case '2':
            return 'nd';

        case '3':
            return 'rd';

        default:
            return 'th';
    }
};
