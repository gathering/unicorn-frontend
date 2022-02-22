import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import { Genre } from '../competition.d';
import type { ICompetition } from '../competition';
import { Input } from '../../../components/Input';
import { httpPost } from '../../../utils/fetcher';
import { parseError } from '../../../utils/error';
import { PrizeEdit } from '../PrizeEdit';
import { FileEdit } from '../FileEdit';
import { CompetitionLinksEdit } from '../CompetitionLinksEdit/CompetitionLinksEdit';
import { Select } from '../../../components/Select';

interface IProps {
    onForward: () => void;
    onPrevious: () => void;
    activeCategory: Genre | null;
}

export const Misc = ({ onForward, onPrevious, activeCategory }: IProps) => {
    const { register, errors, control, handleSubmit } = useFormContext();
    const history = useHistory();

    const onSubmit = (formData: any) => {
        httpPost<ICompetition>(
            'competitions/competitions',
            JSON.stringify({
                ...Object.entries(formData).reduce((competitionObject, [key, value]) => {
                    if (value !== '') {
                        competitionObject[key] = value;
                    }

                    return competitionObject;
                }, {} as { [key: string]: any }),
                rules: JSON.stringify(formData.rules),
                description: JSON.stringify(formData.description),
            })
        )
            .then((d) => {
                history.push(`/admin/competitions/${d.id}`);
                toast.success(`Created competition ${d.name}`);
            })
            .catch((err) => {
                toast.error('Error creating competition');
                parseError(err).forEach((e: any) => toast.error(e));
            });
    };

    return (
        <>
            <h1 className="mb-8 text-3xl">Misc</h1>
            <p className="mb-10 text-gray-700">All fields are optional, and may not apply to your competition.</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="prizes"
                    defaultValue={[]}
                    render={({ onChange, value }) => (
                        <PrizeEdit label="Prizes (optional)" onChange={onChange} value={value} className="mb-6" />
                    )}
                />

                {[Genre.OTHER, Genre.CREATIVE].includes(Number(activeCategory)) ? (
                    <>
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
                                    <label id="votetime-start" className="block mt-6 mb-1">
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
                                    <label id="votetime-end" className="mb-1">
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
                        /> */}
                    </>
                ) : (
                    <>
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
                        <Input
                            label="Custom input field name (optional)"
                            name="contributor_extra"
                            ref={register()}
                            className="mb-6"
                        />
                        <Input label="Toornament ID (optional)" name="toornament" ref={register()} className="mb-6" />

                        <label className="block mb-6">
                            <input name="report_win_loss" type="checkbox" className="mr-2" ref={register()} />
                            Users can report win/loss (optional)
                        </label>
                    </>
                )}

                <Controller
                    control={control}
                    name="register_time_start"
                    render={({ value, ...props }) => (
                        <>
                            <label id="register-end" className="mb-1">
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
                            <label id="register-end" className="mb-1">
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

                <Input
                    type="number"
                    label="Max submission/participants (optional)"
                    name="participant_limit"
                    className="mb-6"
                    ref={register()}
                />

                {/* <label className="block mb-6">
                    <input name="rsvp" type="checkbox" className="mr-2" ref={register()} />
                    RSVP Only (optional)
                </label>

                <label className="block mb-6">
                    <input name="feature" type="checkbox" className="mr-2" ref={register()} />
                    Featured (optional)
                </label> */}

                <Controller
                    control={control}
                    name="visibility"
                    defaultValue=""
                    render={({ onChange, value }) => (
                        <>
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
                        </>
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
