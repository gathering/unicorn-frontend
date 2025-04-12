import React, { useState } from "react";
import { Input } from "../../../components/Input";

interface IProps {
    value: string[];
    onChange: (value: string[]) => void;
    label?: string;
    className?: string;
}

export const PrizeEdit = ({ value, onChange, label, className }: IProps) => {
    const [newPrizeState, setNewPrizeState] = useState("");

    const addPrize = () => {
        onChange([...value, newPrizeState]);
        setNewPrizeState("");
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
        <fieldset className={className ?? ""}>
            <legend className="mb-1">{label ?? "Prizes"}</legend>
            {value.map((v, i) => (
                <fieldset key={i} className="mb-2 flex items-center">
                    <Input
                        value={v}
                        onChange={(e) => handleChange(i, e)}
                        label={`#${i + 1}`}
                        labelClassName="w-10 text-gray-700"
                    />
                    <button
                        type="button"
                        onClick={() => removePrize(i)}
                        className="ml-6 flex h-12 w-32 items-center justify-evenly rounded bg-red-300 px-4 text-base text-red-900 duration-150 hover:bg-red-700 hover:text-black hover:shadow"
                    >
                        Remove
                    </button>
                </fieldset>
            ))}
            <div className="flex flex-wrap">
                <Input
                    value={newPrizeState}
                    onChange={(e) => setNewPrizeState(e.target.value)}
                    label={value.length > 0 ? "" : "Add prize"}
                    className={value.length ? "ml-10" : ""}
                    labelClassName="w-full font-light"
                />
                <button
                    type="button"
                    onClick={addPrize}
                    className="ml-6 flex h-12 w-32 items-center justify-evenly rounded bg-green-300 px-4 text-base text-green-900 duration-150 hover:bg-green-700 hover:text-black hover:shadow"
                >
                    Add
                </button>
            </div>
        </fieldset>
    );
};
