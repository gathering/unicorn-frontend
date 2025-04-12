import { VisuallyHidden } from "@reach/visually-hidden";
import React, { forwardRef, useId } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import styled from "styled-components";

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    errorLabel?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
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

const Input = forwardRef<HTMLInputElement, IProps>(
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
        let labelId = `unicorn-input--${useId()}`;
        let errorLabelId = `unicorn-input-errorlabel--${useId()}`;
        let helpLabelId = `unicorn-input-helplabel--${useId()}`;

        if (id) {
            labelId = id;
            errorLabelId = `${id}-errorlabel`;
            helpLabelId = `${id}-helplabel`;
        }

        if (errorLabel && typeof errorLabel !== "string") {
            errorLabel = String(errorLabel.message);
        }

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
                    className={`block h-12 rounded border border-gray-300 bg-white px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900 ${
                        className ? className : ""
                    } ${
                        errorLabel
                            ? "text-red border border-red-600 focus:border-red-800 dark:border-red-400 dark:focus:border-red-600"
                            : ""
                    } ${fullWidth ? "w-full" : ""}`}
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

Input.displayName = "Input";

export { Input };
