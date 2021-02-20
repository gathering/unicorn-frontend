import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { addHours, addWeeks } from 'date-fns';
import DatePicker from 'react-datepicker';
import draftJs from 'draft-js';
import useSWR from 'swr';
import { httpGet } from '../utils/fetcher';
import { View } from '../components/View';
import { Input } from '../components/Input';
import { Wysiwyg } from '../components/Wysiwyg/Wysiwyg';
import type { ICompetition } from '../features/competitions/competition.types';
import 'react-datepicker/dist/react-datepicker.css';

const initialDate = addHours(new Date(), 1);
initialDate.setMinutes(0, 0, 0);

const CompetitionAdminEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { data: competition } = useSWR<ICompetition>(`competitions/competitions/${id}`, httpGet, {
        revalidateOnFocus: false,
    });
    const { register, handleSubmit, errors, control, reset } = useForm();

    useEffect(() => {
        if (competition) {
            reset({
                ...competition,
                description: draftJs.convertFromRaw(JSON.parse(competition.description)),
                rules: draftJs.convertFromRaw(JSON.parse(competition.rules)),
            });
        }
    }, [competition]);

    const onSubmit = (formData: any) => {
        console.log(formData);
    };

    return (
        <View>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Competition name"
                    name="name"
                    ref={register({ required: 'You need to give the competition a name' })}
                />

                <Input
                    label="Brief description"
                    name="brief_description"
                    ref={register({
                        required: 'You need to give the competition a short and teasing description',
                        maxLength: {
                            message: 'The description should just be a short teaser',
                            value: 40,
                        },
                    })}
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
                                    selected={typeof value === 'string' ? new Date(value) : value}
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
                            <label id="runtime-end">Competition end time</label>
                            {errors.run_time_end && (
                                <label role="alert" className="block text-red-600" id="description-error-label">
                                    {errors.run_time_end.message}
                                </label>
                            )}
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'runtime-end'}
                                    selected={typeof value === 'string' ? new Date(value) : value}
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
                    defaultValue={draftJs.EditorState.createEmpty()}
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
                    defaultValue={draftJs.EditorState.createEmpty()}
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
                />

                <Input
                    label="Poster credit"
                    ref={register({
                        required: 'You must credit the poster',
                    })}
                    name="header_credit"
                    errorLabel={errors.header_credit?.message}
                />

                <footer>
                    <button>Save</button>
                </footer>
            </form>
        </View>
    );
};

export default CompetitionAdminEdit;
