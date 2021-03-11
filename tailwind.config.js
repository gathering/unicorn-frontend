module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                tg: {
                    brand: {
                        orange: '#F4772B',
                    },
                },
            },
        },
        screens: {
            sm: { max: '767px' },
            md: { min: '768px', max: '1023px' },
            lg: { min: '1024px', max: '1279px' },
            xl: { min: '1280px', max: '1535px' },
            '2xl': { min: '1536px' },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
