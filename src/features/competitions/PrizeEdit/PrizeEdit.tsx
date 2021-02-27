import React, { useState } from 'react';
import { Input } from '../../../components/Input';

interface IProps {
    value: string[];
    onChange: (value: string[]) => void;
    label?: string;
    className?: string;
}

export const PrizeEdit = ({ value, onChange, label, className }: IProps) => {
    const [newPrizeState, setNewPrizeState] = useState('');

    const addPrize = () => {
        onChange([...value, newPrizeState]);
        setNewPrizeState('');
    };

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrizeList = [...value];
        newPrizeList[index] = e.target.value;
        onChange(newPrizeList);
    };

    const removePrize = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <fieldset className={className ?? ''}>
            <legend className="mb-1">{label ?? 'Prizes'}</legend>
            {value.map((v, i) => (
                <fieldset className="flex items-center mb-2">
                    <Input
                        value={v}
                        onChange={(e) => handleChange(i, e)}
                        label={`#${i + 1}`}
                        labelClassName="w-10 text-gray-700"
                    />
                    <button
                        type="button"
                        onClick={() => removePrize(i)}
                        className="flex items-center w-32 h-12 px-4 ml-6 text-base text-red-900 duration-150 bg-red-300 rounded justify-evenly hover:bg-red-700 hover:text-black hover:shadow"
                    >
                        Remove
                    </button>
                </fieldset>
            ))}
            <div className="flex flex-wrap">
                <Input
                    value={newPrizeState}
                    onChange={(e) => setNewPrizeState(e.target.value)}
                    label={value.length > 0 ? '' : 'Add prize'}
                    className={!!value.length ? 'ml-10' : ''}
                    labelClassName="w-full font-light"
                />
                <button
                    type="button"
                    onClick={addPrize}
                    className="flex items-center w-32 h-12 px-4 ml-6 text-base text-green-900 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow"
                >
                    Add
                </button>
            </div>
        </fieldset>
    );
};
