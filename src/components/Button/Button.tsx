import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    loading?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(({ loading, children, className, ...props }, ref) => {
    return (
        <button
            className={`p-1 px-2 mx-4 flex items-center text-indigo-700 dark:text-indigo-300 underline transition-all duration-150 rounded-sm hover:text-indigo-900 dark:hover:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-500 ${
                className ?? ""
            }`}
            ref={ref}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="w-5 h-5 mr-3 -ml-1 text-black animate-spin"
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
                            className="text-indigo-900/75"
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
});
