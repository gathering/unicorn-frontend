import { type ChangeEventHandler, forwardRef, type TextareaHTMLAttributes, useId } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import styled from "styled-components";

interface Props extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    errorLabel?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
    label?: string;
    helpLabel?: string;
}

const Label = styled.label`
    display: block;
`;

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
    ({ id, label, className, errorLabel, helpLabel, ...textareaProps }, ref) => {
        let labelId = `unicorn-textarea--${useId()}`;
        let errorLabelId = `unicorn-textarea-errorlabel--${useId()}`;
        let helpLabelId = `unicorn-textarea-helplabel--${useId()}`;

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
                    <Label id={labelId + "-label"} className="mb-1 dark:text-gray-100">
                        {label}
                    </Label>
                ) : null}
                {errorLabel && (
                    <span role="alert" className="text-red-600 dark:text-red-400" id={errorLabelId}>
                        {errorLabel}
                    </span>
                )}
                <textarea
                    aria-labelledby={`${labelId}-label ${helpLabel ? helpLabelId : ""}`}
                    className={className}
                    {...textareaProps}
                    ref={ref}
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

Textarea.displayName = "Textarea";

export { Textarea };
