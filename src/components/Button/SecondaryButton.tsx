import React from "react";

interface Props extends React.ComponentPropsWithRef<"button"> {
    loading?: string;
}

export const SecondaryButton: React.FC<Props> = ({ loading, children, className, ...props }) => {
    return (
        <button
            className={`flex items-center justify-center rounded-lg border-2 border-tg-brand-orange-500 px-7 py-2 text-tg-brand-orange-500 transition-all duration-150 hover:scale-105 hover:border-tg-brand-orange-600 hover:font-semibold ${
                className ?? ""
            }`}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="mx-2 h-5 w-5 animate-spin text-black"
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
                            className="text-tg-brand-orange-500/25"
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
