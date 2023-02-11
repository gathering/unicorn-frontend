import React, { forwardRef } from "react";
import { useId } from "@reach/auto-id";
import VisuallyHidden from "@reach/visually-hidden";
import styled from "styled-components";

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    errorLabel?: string;
    label?: string;
    ariaLabelledBy?: string;
    fullWidth?: boolean;
    labelClassName?: string;
    helpLabel?: string;
}

const Label = styled.label`
    display: block;
`;

const Wrapper = styled.input`
    min-width: 238px;
`;

export const Input = forwardRef<HTMLInputElement, IProps>(
    (
        {
            type = "text",
            placeholder,
            label,
            className,
            errorLabel,
            helpLabel,
            id,
            labelClassName,
            ariaLabelledBy = "",
            fullWidth = false,
            ...inputProps
        },
        ref
    ) => {
        const labelId = id || `unicorn-input--${useId()}`;
        const errorLabelId = id ? `${id}-errorlabel` : `unicorn-input-errorlabel--${useId()}`;
        const helpLabelId = id ? `${id}-helplabel` : `unicorn-input-helplabel--${useId()}`;

        return (
            <>
                {label ? (
                    <Label id={labelId + "-label"} className={labelClassName ?? "mb-1 dark:text-gray-100"}>
                        {label}
                    </Label>
                ) : (
                    <VisuallyHidden id={labelId}>{placeholder}</VisuallyHidden>
                )}
                {errorLabel && (
                    <span role="alert" className="text-red-600 dark:text-red-400" id={errorLabelId}>
                        {errorLabel}
                    </span>
                )}
                <Wrapper
                    className={`block px-4 h-12 leading-tight text-gray-700 dark:text-gray-100 bg-white dark:bg-gray-800 rounded focus:outline-none focus:bg-white dark:focus:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:border-gray-500 ${
                        className ? className : ""
                    } ${
                        errorLabel
                            ? "text-red border-red-600 dark:border-red-400 focus:border-red-800 dark:focus:border-red-600 border"
                            : ""
                    }
                    ${fullWidth ? "w-full" : ""}`}
                    aria-labelledby={`${labelId}-label ${ariaLabelledBy} ${helpLabel ? helpLabelId : ""}`}
                    type={type}
                    placeholder={placeholder}
                    aria-describedby={errorLabel ? errorLabelId : undefined}
                    ref={ref}
                    {...inputProps}
                />
                {helpLabel && (
                    <span className="text-sm" id={helpLabelId}>
                        {helpLabel}
                    </span>
                )}
            </>
        );
    }
);
