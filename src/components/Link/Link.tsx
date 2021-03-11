import React from 'react';
import { Link as RRDLink, LinkProps } from 'react-router-dom';

interface Props extends LinkProps {
    className?: string;
}

export const Link = ({ className, ...props }: Props) => {
    return (
        <RRDLink
            {...props}
            className={`p-1 px-2 ml-6 text-indigo-700 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200 ${
                className ?? ''
            }`}
        />
    );
};
