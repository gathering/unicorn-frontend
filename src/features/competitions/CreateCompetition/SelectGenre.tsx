import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import useSWR from 'swr';
import { httpGet } from '../../../utils/fetcher';
import { Select } from '../../../components/Select';
import type { Genre, IGenreResponse } from '../competition';

interface IProps {
    onForward: () => void;
    onPrevious: () => void;
    activeCategory: Genre | null;
}

export const SelectGenre = ({ onForward, onPrevious }: IProps) => {
    const { data: genres } = useSWR<IGenreResponse>('competitions/genres', httpGet);
    const { errors, handleSubmit, control, register } = useFormContext();

    const onSubmit = () => {
        onForward();
    };

    if (!genres?.results.length) {
        return (
            <>
                <h1 className="mb-8 text-3xl">Create new competition</h1>
                <p className="mb-10 text-gray-700 dark:text-gray-200">
                    No available genres found... Please contact the administrators to set up genres.
                </p>
            </>
        );
    }

    return (
        <>
            <h1 className="mb-8 text-3xl dark:text-gray-100">Create new competition</h1>
            <p className="mb-10 text-gray-700 dark:text-gray-200">
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
                            {errors.genre?.message && (
                                <label className="flex items-center mt-1 text-red-600 dark:text-red-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-4 h-4 mr-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {errors.genre?.message}
                                </label>
                            )}
                        </>
                    )}
                />
                <footer className="mt-8">
                    <button className="flex items-center h-12 px-4 text-base text-green-900 dark:text-green-200 duration-150 bg-green-300 dark:bg-green-800 rounded justify-evenly hover:bg-green-700 dark:hover:bg-green-500 hover:text-black hover:shadow">
                        Forward
                    </button>
                </footer>
            </form>
        </>
    );
};
