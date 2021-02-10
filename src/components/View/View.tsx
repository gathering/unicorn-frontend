import React from 'react';

export const View: React.FC = ({ children }) => {
    return <main className="flex-grow">{children}</main>;
};
