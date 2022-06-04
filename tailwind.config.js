module.exports = {
    purge: [],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                'tg-brand-orange': {
                    50: '#faf5e9',
                    100: '#fbedcd',
                    200: '#f8df9a',
                    300: '#f5c857',
                    400: '#f1a422',
                    500: '#f4772b',
                    600: '#e45a0a',
                    700: '#c4430e',
                    800: '#a13515',
                    900: '#842c16',
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
        extend: {
            borderWidth: ['hover'],
            margin: ['hover'],
            padding: ['hover'],
            fontWeight: ['hover'],
        },
    },
    plugins: [],
};
