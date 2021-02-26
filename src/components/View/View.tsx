import React from 'react';

interface IProps {
    className?: string;
}

export const View: React.FC<IProps> = ({ children, className }) => {
    return <main className={`flex-grow ${className ?? ''}`}>{children}</main>;
};
