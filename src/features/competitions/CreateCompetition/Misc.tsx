import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import { Genre, ICompetition } from '../competition.types';
import { Input } from '../../../components/Input';
import { httpPost } from '../../../utils/fetcher';
import { parseError } from '../../../utils/error';
import { PrizeEdit } from '../PrizeEdit';

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
                rules: formData.rules ? JSON.stringify(formData.rules) : null,
                description: formData.rules ? JSON.stringify(formData.description) : null,
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
            <h1>Misc</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="prizes"
                    defaultValue={[]}
                    render={({ onChange, value }) => (
                        <PrizeEdit label="Prizes (optional)" onChange={onChange} value={value} />
                    )}
                />

                {[Genre.OTHER, Genre.CREATIVE].includes(Number(activeCategory)) ? (
                    <>
                        <Controller
                            control={control}
                            name="vote_time_start"
                            render={({ value, ...props }) => (
                                <>
                                    <label id="votetime-start">Vote start time (optional)</label>
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
                                    <label id="votetime-end">Vote end time (optional)</label>
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
                        <Input type="number" label="Minimum team size (optional)" name="team_min" ref={register()} />
                        <Input type="number" label="Maximum team size (optional)" name="team_max" ref={register()} />
                        <Input label="Custom input field name (optional)" name="contributor_extra" ref={register()} />

                        <h1>TODO File upload settings</h1>
                    </>
                ) : (
                    <>
                        <Input type="number" label="Minimum team size (optional)" name="team_min" ref={register()} />
                        <Input type="number" label="Maximum team size (optional)" name="team_max" ref={register()} />
                        <Input label="Custom input field name (optional)" name="contributor_extra" ref={register()} />
                        <Input label="Toornament ID (optional)" name="toornament" ref={register()} />
                        <label>
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
                            <label id="register-end">Registration start time (optional)</label>
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
                            <label id="register-end">Registration end time (optional)</label>
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
                            <label id="showtime-end">Competition show start time (optional)</label>
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
                            <label id="showtime-end">Competition show end time (optional)</label>
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

                <Input name="external_url_login" type="url" label="Login URL (optional)" ref={register()} />
                <Input name="external_url_info" type="url" label="Homepage URL (optional)" ref={register()} />

                <Input
                    type="number"
                    label="Max submission/participants (optional)"
                    name="participant_limit"
                    ref={register()}
                />

                <label>
                    <input name="rsvp" type="checkbox" className="mr-2" ref={register()} />
                    RSVP Only (optional)
                </label>

                <label>
                    <input name="feature" type="checkbox" className="mr-2" ref={register()} />
                    Featured (optional)
                </label>

                <footer className="flex flex-row-reverse justify-end">
                    <button>Save</button>
                    <button type="button" onClick={onPrevious}>
                        Previous
                    </button>
                </footer>
            </form>
        </>
    );
};
