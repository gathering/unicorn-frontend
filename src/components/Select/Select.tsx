import React from 'react';
import { ListboxOption, ListboxInput, ListboxButton, ListboxPopover, ListboxList, ListboxValue } from '@reach/listbox';
import { useId } from '@reach/auto-id';
import VisuallyHidden from '@reach/visually-hidden';
import styled from 'styled-components';

interface IOptions {
    label: string;
    value: string | number;
}

interface IProps {
    options: IOptions[];
    placeholder?: string;
    label?: string;
    value: string;
    onChange: (newValue: ListboxValue) => void;
}

const Wrapper = styled.div`
    min-width: 238px;
`;

export const Select = ({ options, placeholder, label, value, onChange }: IProps) => {
    let labelId = `unicorn-select--${useId()}`;

    return (
        <Wrapper>
            {label ? <label id={labelId}>{label}</label> : <VisuallyHidden id={labelId}>{placeholder}</VisuallyHidden>}
            <ListboxInput aria-labelledby={labelId} value={value} onChange={(value) => onChange(value)}>
                <ListboxButton className="flex items-center justify-between w-full h-12 px-4 text-base duration-150 bg-white rounded hover:shadow">
                    {({ label: optionLabel, value, isExpanded }) => (
                        <>
                            <span className={value ? '' : 'text-gray-600'}>{value ? optionLabel : placeholder}</span>
                            {isExpanded ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </>
                    )}
                </ListboxButton>
                <ListboxPopover className="w-48 mt-2 bg-white rounded shadow-lg">
                    <ListboxList>
                        {options.map((option) => (
                            <ListboxOption
                                key={option.value}
                                className="px-4 py-2 hover:bg-indigo-500 hover:text-white hover:cursor-pointer"
                                value={option.value.toString()}
                            >
                                {option.label}
                            </ListboxOption>
                        ))}
                    </ListboxList>
                </ListboxPopover>
            </ListboxInput>
        </Wrapper>
    );
};
