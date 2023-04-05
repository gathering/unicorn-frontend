import { ChangeEvent, ChangeEventHandler, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useId } from "react";
import styled from "styled-components";

interface Props extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    errorLabel?: string;
    label?: string;
    helpLabel?: string;
}

const Label = styled.label`
    display: block;
`;

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
    ({ id, label, className, errorLabel, helpLabel, ...textareaProps }, ref) => {
        const labelId = id || `unicorn-textarea--${useId()}`;
        const errorLabelId = id ? `${id}-errorlabel` : `unicorn-textarea-errorlabel--${useId()}`;
        const helpLabelId = id ? `${id}-helplabel` : `unicorn-textarea-helplabel--${useId()}`;

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
                    <span className="text-sm " id={helpLabelId}>
                        {helpLabel}
                    </span>
                )}
            </>
        );
    }
);
