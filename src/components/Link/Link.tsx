import React from "react";
import { Link as RRDLink } from "react-router-dom";
import type { LinkProps } from "react-router-dom";

interface Props extends LinkProps {
    className?: string;
    inline?: boolean;
}

export const Link = ({ className, inline, ...props }: Props) => {
    return (
        <RRDLink
            {...props}
            className={`py-1 ${
                inline ? "hover:px-2 px-0" : "px-1"
            } text-indigo-700 dark:text-indigo-300 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200 dark:hover:text-indigo-100 dark:hover:bg-indigo-700 ${
                className ?? ""
            }`}
        />
    );
};
