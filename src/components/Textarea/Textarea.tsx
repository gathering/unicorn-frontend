import { clsx } from "clsx";
import { type ChangeEventHandler, forwardRef, type TextareaHTMLAttributes, useId } from "react";
import type { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface Props extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
    onChange?: ChangeEventHandler<HTMLTextAreaElement>;
    errorLabel?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | string;
    label?: string;
    helpLabel?: string;
}

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
                    <label id={labelId + "-label"} className="mb-1 block dark:text-gray-100">
                        {label}
                    </label>
                ) : null}
                {errorLabel && (
                    <span role="alert" className="text-red-600 dark:text-red-400" id={errorLabelId}>
                        {errorLabel}
                    </span>
                )}
                <textarea
                    aria-labelledby={`${labelId}-label ${helpLabel ? helpLabelId : ""}`}
                    className={clsx(className, "bg-white")}
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
