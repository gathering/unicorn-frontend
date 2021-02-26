import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { EditorState, convertToRaw } from 'draft-js';
import DatePicker from 'react-datepicker';
import { addHours, addWeeks } from 'date-fns';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from '../../../components/Input';
import { Wysiwyg } from '../../../components/Wysiwyg/Wysiwyg';
import type { Genre } from '../competition.types';

interface IProps {
    onForward: () => void;
    onPrevious: () => void;
    activeCategory: Genre | null;
}

const initialDate = addHours(new Date(), 1);
initialDate.setMinutes(0, 0, 0);

export const GeneralSettings = ({ onForward, onPrevious }: IProps) => {
    const { register, errors, handleSubmit, control, watch } = useFormContext();

    const onSubmit = () => {
        onForward();
    };

    return (
        <>
            <h1 className="mb-8 text-3xl">General settings</h1>
            <p className="mb-10 text-gray-700">
                All of these inputs are mandatory. They are the base data for the competition. If you're not sure what
                to put into the fields yet, you may put in some dummy data for now. After creating the competition you
                may come back to edit the fields.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    name="name"
                    label="Competition title"
                    className="mb-6"
                    ref={register({ required: 'You need to give the competition a title' })}
                    errorLabel={errors.name?.message}
                />

                <Input
                    name="brief_description"
                    label="Brief description"
                    className="mb-6"
                    ref={register({
                        required: 'You need to give the competition a short teasing description',
                        maxLength: {
                            message: 'The length is limited to 40 characters. This should only be a short tease',
                            value: 40,
                        },
                    })}
                    errorLabel={errors.brief_description?.message}
                />

                <Controller
                    control={control}
                    name="run_time_start"
                    rules={{
                        required: 'You must give the competition a start time',
                    }}
                    defaultValue={initialDate}
                    render={({ value, ...props }) => (
                        <>
                            <label id="runtime-start">Competition start time</label>
                            {errors.run_time_start && (
                                <label role="alert" className="block text-red-600" id="description-error-label">
                                    {errors.run_time_start.message}
                                </label>
                            )}
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'runtime-start'}
                                    selected={value}
                                    {...props}
                                    timeInputLabel="Time:"
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className={`block px-4 h-12 mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500 ${
                                        errors.run_time_start
                                            ? 'text-red border-red-600  focus:border-red-800 border'
                                            : ''
                                    }`}
                                    showTimeInput
                                />
                            </div>
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="run_time_end"
                    defaultValue={addWeeks(initialDate, 1)}
                    rules={{
                        required: 'You must give the competition an end time',
                    }}
                    render={({ value, ...props }) => (
                        <>
                            <label id="runtime-end" className="mt-6">
                                Competition end time
                            </label>
                            {errors.run_time_end && (
                                <label role="alert" className="block text-red-600" id="description-error-label">
                                    {errors.run_time_end.message}
                                </label>
                            )}
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'runtime-end'}
                                    selected={value}
                                    {...props}
                                    timeInputLabel="Time:"
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className={`block px-4 h-12 mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500 ${
                                        errors.run_time_end
                                            ? 'text-red border-red-600  focus:border-red-800 border'
                                            : ''
                                    }`}
                                    showTimeInput
                                />
                            </div>
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="description"
                    rules={{
                        required: 'You must write a description for the competition',
                    }}
                    defaultValue={convertToRaw(EditorState.createEmpty().getCurrentContent())}
                    render={({ onChange, value }) => (
                        <Wysiwyg
                            label="Competition description"
                            onChange={onChange}
                            defaultState={value}
                            errorLabel={errors.description?.message}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="rules"
                    rules={{
                        required: 'You must write a ruleset for the competition',
                    }}
                    defaultValue={convertToRaw(EditorState.createEmpty().getCurrentContent())}
                    render={({ onChange, value }) => (
                        <Wysiwyg
                            label="Competition rules"
                            errorLabel={errors.rules?.message}
                            onChange={onChange}
                            defaultState={value}
                        />
                    )}
                />

                <Input
                    label="Poster url"
                    type="url"
                    ref={register({ required: 'You must add a poster for the competition' })}
                    name="header_image"
                    errorLabel={errors.header_image?.message}
                    className="mb-6"
                />

                <Input
                    label="Poster credit"
                    ref={register({
                        required: 'You must credit the poster',
                    })}
                    name="header_credit"
                    errorLabel={errors.header_credit?.message}
                />

                <footer className="flex flex-row-reverse justify-end mt-8">
                    <button className="flex items-center h-12 px-4 ml-6 text-base text-green-900 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow">
                        Next
                    </button>
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="flex items-center h-12 px-4 text-base text-yellow-900 duration-150 bg-yellow-300 rounded justify-evenly hover:bg-yellow-700 hover:text-black hover:shadow"
                    >
                        Previous
                    </button>
                </footer>
            </form>
        </>
    );
};
