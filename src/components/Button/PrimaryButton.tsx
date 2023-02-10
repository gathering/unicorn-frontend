import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    loading?: string;
}

export const PrimaryButton: React.FC<Props> = ({ loading, children, className, ...props }) => {
    return (
        <button
            className={`py-2 px-7 hover:scale-105 rounded-lg flex justify-center items-center text-white transition-all duration-150 bg-tg-brand-orange-500 hover:bg-tg-brand-orange-600 hover:font-semibold ${
                className ?? ''
            }`}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="w-5 h-5 mx-2 text-black animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="text-white/25"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    {loading}
                </>
            ) : (
                children
            )}
        </button>
    );
};
