import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { ContentState, convertToRaw, RawDraftContentState } from 'draft-js';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { httpGet, httpPut } from '../utils/fetcher';
import { View } from '../components/View';
import { Input } from '../components/Input';
import { Wysiwyg } from '../components/Wysiwyg';
import type { ICompetition } from '../features/competitions/competition';
import { PrizeEdit } from '../features/competitions/PrizeEdit';
import { CompetitionLinksEdit } from '../features/competitions/CompetitionLinksEdit';
import { parseError } from '../utils/error';
import { FileEdit } from '../features/competitions/FileEdit';
import 'react-datepicker/dist/react-datepicker.css';
import { Select } from '../components/Select';

const CompetitionAdminEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { data: competition, revalidate } = useSWR<ICompetition>(`competitions/competitions/${id}`, httpGet, {
        revalidateOnFocus: false,
    });
    const { register, handleSubmit, errors, control, reset } = useForm();

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (competition) {
            let rulesObj: string | RawDraftContentState = competition.rules;
            let descObj: string | RawDraftContentState =
                competition.description ?? convertToRaw(ContentState.createFromText(''));

            try {
                rulesObj = JSON.parse(rulesObj as string) as RawDraftContentState;
            } catch (e) {
                rulesObj = convertToRaw(ContentState.createFromText(rulesObj as string));
            }

            try {
                if (descObj) {
                    descObj = JSON.parse(descObj as string) as RawDraftContentState;
                } else {
                    descObj = convertToRaw(ContentState.createFromText(''));
                }
            } catch (e) {
                descObj = convertToRaw(ContentState.createFromText(descObj as string));
            }

            reset({
                ...competition,
                description: descObj,
                rules: rulesObj,
                run_time_start: competition.run_time_start ? new Date(competition.run_time_start) : null,
                run_time_end: competition.run_time_end ? new Date(competition.run_time_end) : null,
                vote_time_start: competition.vote_time_start ? new Date(competition.vote_time_start) : null,
                vote_time_end: competition.vote_time_end ? new Date(competition.vote_time_end) : null,
                show_prestart_lock: competition.show_prestart_lock ? new Date(competition.show_prestart_lock) : null,
                show_time_start: competition.show_time_start ? new Date(competition.show_time_start) : null,
                show_time_end: competition.show_time_end ? new Date(competition.show_time_end) : null,
                register_time_start: competition.register_time_start ? new Date(competition.register_time_start) : null,
                register_time_end: competition.register_time_end ? new Date(competition.register_time_end) : null,
            });

            setShowForm(true);
        }
    }, [competition]);

    const onSubmit = (formData: any) => {
        if (!competition) {
            return;
        }

        httpPut<ICompetition>(
            `competitions/competitions/${competition.id}`,
            JSON.stringify({
                ...Object.entries(formData).reduce((competitionObject, [key, value]) => {
                    if (value !== '') {
                        competitionObject[key] = value;
                    }

                    return competitionObject;
                }, {} as { [key: string]: any }),
                genre: competition.genre.id,
                rules: JSON.stringify(formData.rules),
                description: JSON.stringify(formData.description),
            })
        )
            .then((d) => {
                toast.success(`Updated competition ${d.name}`);
                revalidate();
            })
            .catch((err) => {
                toast.error('Error updating competition');
                parseError(err).forEach((e: any) => toast.error(e));
            });
    };

    if (!showForm) {
        return null;
    }

    return (
        <View className="flex flex-col items-center my-16">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-prose">
                <h1 className="mb-8 text-3xl">Edit {competition?.name}</h1>

                <Input
                    label="Competition name"
                    name="name"
                    className="mb-6 w-full"
                    ref={register({ required: 'You need to give the competition a name' })}
                />

                <Input
                    label="Brief description"
                    name="brief_description"
                    className="mb-6 w-full"
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
                    render={({ onChange, value }) => (
                        <Wysiwyg
                            label="Competition rules"
                            onChange={onChange}
                            defaultState={value}
                            errorLabel={errors.rules?.message}
                        />
                    )}
                />

                <Input
                    label="Poster image URL"
                    type="url"
                    className="mb-6 w-full"
                    ref={register({ required: 'You must add a poster for the competition' })}
                    name="header_image"
                    errorLabel={errors.header_image?.message}
                />

                <Input
                    label="Poster image credit"
                    className="mb-6 w-full"
                    ref={register({
                        required: 'You must credit the poster',
                    })}
                    name="header_credit"
                    errorLabel={errors.header_credit?.message}
                />

                <Controller
                    control={control}
                    name="prizes"
                    defaultValue={[]}
                    render={({ onChange, value }) => (
                        <PrizeEdit label="Prizes (optional)" onChange={onChange} value={value} className="mb-6" />
                    )}
                />

                <Controller
                    control={control}
                    name="fileupload"
                    defaultValue={[]}
                    render={({ onChange, value }) => (
                        <FileEdit onChange={onChange} value={value} label="Upload files (optional)" />
                    )}
                />

                <Controller
                    control={control}
                    name="vote_time_start"
                    render={({ value, ...props }) => (
                        <>
                            <label id="votetime-start" className="block mb-1">
                                Vote start time (optional)
                            </label>
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'votetime-start'}
                                    selected={value}
                                    {...props}
                                    timeInputLabel="Time:"
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className={`unicorn-input block px-4 h-12 mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500`}
                                    showTimeInput
                                />
                            </div>
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name="vote_time_end"
                    render={({ value, ...props }) => (
                        <>
                            <label id="votetime-end" className="block mb-1">
                                Vote end time (optional)
                            </label>
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'votetime-end'}
                                    selected={value}
                                    {...props}
                                    timeInputLabel="Time:"
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className={`unicorn-input block px-4 h-12 mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500`}
                                    showTimeInput
                                />
                            </div>
                        </>
                    )}
                />

                <Input
                    type="number"
                    label="Max submission/participants (optional)"
                    name="participant_limit"
                    ref={register()}
                    className="mb-6"
                />

                <Input
                    type="number"
                    label="Minimum team size (optional)"
                    name="team_min"
                    ref={register()}
                    className="mb-6"
                />
                <Input
                    type="number"
                    label="Maximum team size (optional)"
                    name="team_max"
                    ref={register()}
                    className="mb-6"
                />

                {/* <Input
                    label="Custom input field name (optional)"
                    name="contributor_extra"
                    ref={register()}
                    className="mb-6"
                />
                <Input label="Toornament ID (optional)" name="toornament" ref={register()} className="mb-6" />
                <label className="block mb-6">
                    <input name="report_win_loss" type="checkbox" className="mr-2" ref={register()} />
                    Users can report win/loss (optional)
                </label> */}

                {/* <Controller
                    control={control}
                    name="register_time_start"
                    render={({ value, ...props }) => (
                        <>
                            <label id="register-end" className="block mb-1">
                                Registration start time (optional)
                            </label>
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'register-end'}
                                    selected={value}
                                    {...props}
                                    timeInputLabel="Time:"
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className={`unicorn-input block px-4 h-12 mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500`}
                                    showTimeInput
                                />
                            </div>
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="register_time_end"
                    render={({ value, ...props }) => (
                        <>
                            <label id="register-end" className="block mb-1">
                                Registration end time (optional)
                            </label>
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'register-end'}
                                    selected={value}
                                    {...props}
                                    timeInputLabel="Time:"
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className={`unicorn-input block px-4 h-12 mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500`}
                                    showTimeInput
                                />
                            </div>
                        </>
                    )}
                /> */}

                <Controller
                    control={control}
                    name="show_prestart_lock"
                    render={({ value, ...props }) => (
                        <>
                            <label id="showtime-lock" className="block mb-1">
                                Pre-show lockdown start (optional)
                            </label>
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'showtime-lock'}
                                    selected={value}
                                    {...props}
                                    timeInputLabel="Time:"
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className={`unicorn-input block px-4 h-12 mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500`}
                                    showTimeInput
                                />
                            </div>
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="show_time_start"
                    render={({ value, ...props }) => (
                        <>
                            <label id="showtime-end" className="block mb-1">
                                Competition show start time (optional)
                            </label>
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'showtime-end'}
                                    selected={value}
                                    {...props}
                                    timeInputLabel="Time:"
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className={`unicorn-input block px-4 h-12 mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500`}
                                    showTimeInput
                                />
                            </div>
                        </>
                    )}
                />

                <Controller
                    control={control}
                    name="show_time_end"
                    render={({ value, ...props }) => (
                        <>
                            <label id="showtime-end" className="block mb-1">
                                Competition show end time (optional)
                            </label>
                            <div className="block">
                                <DatePicker
                                    ariaLabelledBy={'showtime-end'}
                                    selected={value}
                                    {...props}
                                    timeInputLabel="Time:"
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    className={`unicorn-input block px-4 h-12 mb-6 leading-tight text-gray-700 bg-white rounded shadow focus:outline-none focus:bg-white focus:border-gray-500`}
                                    showTimeInput
                                />
                            </div>
                        </>
                    )}
                />

                {/* <Input
                    name="external_url_login"
                    type="url"
                    label="Login URL (optional)"
                    ref={register()}
                    className="mb-6"
                />
                <Input
                    name="external_url_info"
                    type="url"
                    label="Homepage URL (optional)"
                    ref={register()}
                    className="mb-6"
                /> */}

                {/* <label className="block mb-1">
                    <input name="rsvp" type="checkbox" className="mr-2" ref={register()} />
                    RSVP Only (optional)
                </label> */}

                {/* <label className="block mb-1">
                    <input name="feature" type="checkbox" className="mr-2" ref={register()} />
                    Featured (optional)
                </label> */}

                <Controller
                    control={control}
                    name="visibility"
                    defaultValue=""
                    render={({ onChange, value }) => (
                        <Select
                            label="Visibility"
                            options={[
                                {
                                    label: 'Public',
                                    value: 'public',
                                },
                                {
                                    label: 'Crew',
                                    value: 'crew',
                                },
                                {
                                    label: 'Hidden',
                                    value: 'hidden',
                                },
                            ]}
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />

                <Controller
                    control={control}
                    defaultValue={[]}
                    name="links"
                    render={(props) => <CompetitionLinksEdit {...props} />}
                />

                <footer className="flex flex-row-reverse justify-end mt-8">
                    <button className="flex items-center h-12 px-4 ml-6 text-base text-green-900 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow">
                        Save
                    </button>
                    <Link
                        to="/admin/competitions"
                        className="flex items-center h-12 px-4 text-base text-yellow-900 duration-150 bg-yellow-300 rounded justify-evenly hover:bg-yellow-700 hover:text-black hover:shadow"
                    >
                        Cancel
                    </Link>
                </footer>
            </form>
        </View>
    );
};

export default CompetitionAdminEdit;
