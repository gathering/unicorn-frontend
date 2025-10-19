import React from "react";

interface Props extends React.ComponentPropsWithRef<"button"> {
    loading?: string;
}

const Button = React.forwardRef<HTMLButtonElement, Props>(({ loading, children, className, ...props }, ref) => {
    return (
        <button
            className={`mx-4 flex items-center rounded-xs p-1 px-2 text-indigo-700 underline transition-all duration-150 hover:bg-indigo-200 hover:text-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-500 dark:hover:text-indigo-100 ${
                className ?? ""
            }`}
            ref={ref}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="-ml-1 mr-3 h-5 w-5 animate-spin text-black"
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

Button.displayName = "Button";

export { Button };
