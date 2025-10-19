import type { LinkProps } from "react-router";
import { Link as RRDLink } from "react-router";

interface Props extends LinkProps {
    className?: string;
    inline?: boolean;
}

export const Link = ({ className, inline, ...props }: Props) => {
    return (
        <RRDLink
            {...props}
            className={`py-1 ${
                inline ? "px-0 hover:px-2" : "px-1"
            } rounded-xs text-indigo-700 underline transition-all duration-150 hover:bg-indigo-200 hover:text-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-700 dark:hover:text-indigo-100 ${
                className ?? ""
            }`}
        />
    );
};
