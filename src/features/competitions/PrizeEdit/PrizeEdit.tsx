import React, { useState } from 'react';
import { Input } from '../../../components/Input';

interface IProps {
    value: string[];
    onChange: (value: string[]) => void;
    label?: string;
}

export const PrizeEdit = ({ value, onChange, label }: IProps) => {
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
        <fieldset>
            <legend>{label ?? 'Prizes'}</legend>
            {value.map((v, i) => (
                <>
                    <Input value={v} onChange={(e) => handleChange(i, e)} label={`#${i}`} />
                    <button type="button" onClick={() => removePrize(i)}>
                        Remove
                    </button>
                </>
            ))}
            <Input value={newPrizeState} onChange={(e) => setNewPrizeState(e.target.value)} label="Add prize" />
            <button type="button" onClick={addPrize}>
                Add
            </button>
        </fieldset>
    );
};
