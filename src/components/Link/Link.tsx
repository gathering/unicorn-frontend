import React from 'react';
import { Link as RRDLink, LinkProps } from 'react-router-dom';

interface Props extends LinkProps {
    className?: string;
    inline?: boolean;
}

export const Link = ({ className, inline, ...props }: Props) => {
    return (
        <RRDLink
            {...props}
            className={`p-1 ${
                inline ? 'hover:px-2' : 'px-2'
            } text-indigo-700 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200 ${
                className ?? ''
            }`}
        />
    );
};
