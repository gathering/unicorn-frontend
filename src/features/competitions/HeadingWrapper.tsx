import clsx from "clsx";
import React from "react";

const HeadingWrapper: React.FC<React.HTMLProps<HTMLHeadingElement>> = ({ children, className, ...props }) => {
    return (
        <h1
            style={{ background: "linear-gradient(5deg, #00000088 30%, #ffffff22 100%)" }}
            className={clsx(
                className,
                "absolute bottom-0 flex h-full w-full items-end rounded-md px-4 pb-3 text-5xl text-gray-50"
            )}
            {...props}
        >
            {children}
        </h1>
    );
};

export default HeadingWrapper;
