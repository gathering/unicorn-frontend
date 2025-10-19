import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React from "react";

interface IOptions {
    label: string;
    value: string;
}

interface IProps {
    options: IOptions[];
    placeholder?: string;
    label?: string;
    value: string;
    onChange: (newValue: string) => void;
}

export const Select = ({ options, placeholder, label, value, onChange }: IProps) => {
    const currentValueLabel = options.find((option) => option.value === value)?.label;

    return (
        <div className="w-72">
            <Listbox value={value} onChange={onChange}>
                <div className="relative mt-1">
                    <Label>{label}</Label>

                    <ListboxButton className="relative h-11 w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-hidden focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 dark:bg-gray-800 dark:text-gray-100 sm:text-sm">
                        <span className="block truncate">{currentValueLabel ?? placeholder}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                    </ListboxButton>
                    <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-hidden sm:text-sm">
                            {options.map((option) => (
                                <ListboxOption
                                    key={option.value}
                                    className={({ focus }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            focus ? "bg-amber-100 text-amber-900" : "text-gray-900"
                                        }`
                                    }
                                    value={option.value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                                            >
                                                {option.label}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    <CheckIcon
                                                        className="h-5 w-5 to-tg-brand-orange-500"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};
