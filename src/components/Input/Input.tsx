import React, { forwardRef } from 'react';
import { useId } from '@reach/auto-id';
import VisuallyHidden from '@reach/visually-hidden';
import styled from 'styled-components';

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    hasError?: boolean;
    label?: string;
    ariaLabelledBy?: string;
    fullWidth?: boolean;
}

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
            hasError,
            id,
            ariaLabelledBy = '',
            fullWidth = false,
            ...inputProps
        },
        ref
    ) => {
        let labelId = id || `unicorn-input--${useId()}`;

        return (
            <>
                {label ? (
                    <label id={labelId + '-label'}>{label}</label>
                ) : (
                    <VisuallyHidden id={labelId}>{placeholder}</VisuallyHidden>
                )}
                <Wrapper
                    className={`block px-4 h-12 leading-tight text-gray-700 bg-white rounded focus:outline-none focus:bg-white border border-gray-300 focus:border-gray-500 ${
                        className ? className : ''
                    } ${hasError ? 'text-red border-red-600  focus:border-red-800 border' : ''}
                    ${fullWidth ? 'w-full' : ''}`}
                    aria-labelledby={`${labelId}-label ${ariaLabelledBy}`}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    {...inputProps}
                />
            </>
        );
    }
);
