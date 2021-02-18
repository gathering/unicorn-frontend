import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import useSWR from 'swr';
import { httpGet } from '../../../utils/fetcher';
import { Select } from '../../../components/Select';
import type { Genre, IGenreResponse } from '../competition.types';

interface IProps {
    onForward: () => void;
    onPrevious: () => void;
    activeCategory: Genre | null;
}

export const SelectGenre = ({ onForward, onPrevious }: IProps) => {
    const { data: genres } = useSWR<IGenreResponse>('competitions/genres', httpGet);
    const { errors, handleSubmit, control, watch } = useFormContext();

    const onSubmit = () => {
        onForward();
    };

    return (
        <>
            <h1>Create new competition</h1>
            <p>
                Some features may be hidden based on what genre you choose. All features will be available after initial
                creation.
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="genre"
                    defaultValue="__default_value__"
                    rules={{ validate: (v) => v !== '__default_value__' || 'You must select a genre' }}
                    render={({ onChange, value }) => (
                        <>
                            <Select
                                label="Select genre"
                                options={[
                                    { name: 'Choose a genre', id: '__default_value__' },
                                    ...(genres?.results || []),
                                ].map((g) => ({
                                    label: g.name,
                                    value: g.id,
                                }))}
                                onChange={onChange}
                                value={value}
                            />
                            {errors.genre?.message && <label>{errors.genre?.message}</label>}
                        </>
                    )}
                />
                <footer>
                    <button>Forward</button>
                </footer>
            </form>
        </>
    );
};
