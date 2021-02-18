import React, { forwardRef } from 'react';
import { useId } from '@reach/auto-id';
import VisuallyHidden from '@reach/visually-hidden';
import styled from 'styled-components';

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    errorLabel?: string;
    label?: string;
    ariaLabelledBy?: string;
    fullWidth?: boolean;
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
            type = 'text',
            placeholder,
            value,
            onChange,
            label,
            className,
            errorLabel,
            id,
            ariaLabelledBy = '',
            fullWidth = false,
            ...inputProps
        },
        ref
    ) => {
        let labelId = id || `unicorn-input--${useId()}`;
        let errorLabelId = id ? `${id}-errorlabel` : `unicorn-input-errorlabel--${useId()}`;

        return (
            <>
                {label ? (
                    <Label id={labelId + '-label'}>{label}</Label>
                ) : (
                    <VisuallyHidden id={labelId}>{placeholder}</VisuallyHidden>
                )}
                {errorLabel && (
                    <span role="alert" className="text-red-600" id={errorLabelId}>
                        {errorLabel}
                    </span>
                )}
                <Wrapper
                    className={`block px-4 h-12 leading-tight text-gray-700 bg-white rounded focus:outline-none focus:bg-white border border-gray-300 focus:border-gray-500 ${
                        className ? className : ''
                    } ${errorLabel ? 'text-red border-red-600  focus:border-red-800 border' : ''}
                    ${fullWidth ? 'w-full' : ''}`}
                    aria-labelledby={`${labelId}-label ${ariaLabelledBy}`}
                    type={type}
                    placeholder={placeholder}
                    aria-describedby={errorLabel ? errorLabelId : undefined}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    {...inputProps}
                />
            </>
        );
    }
);
