import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useFormContext } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { parseError } from "../../../utils/error";
import { httpPost } from "../../../utils/fetcher";
import type { ICompetition } from "../competition";
import { Genre } from "../competition.d";
import { CompetitionLinksEdit } from "../CompetitionLinksEdit/CompetitionLinksEdit";
import { FileEdit } from "../FileEdit";
import { PrizeEdit } from "../PrizeEdit";

interface IProps {
    onForward: () => void;
    onPrevious: () => void;
    activeCategory: Genre | null;
}

export const Misc = ({ onPrevious, activeCategory }: IProps) => {
    const { register, control, handleSubmit } = useFormContext();
    const navigate = useNavigate();

    const onSubmit = (formData: any) => {
        httpPost<ICompetition>(
            "competitions/competitions",
            JSON.stringify({
                ...Object.entries(formData).reduce(
                    (competitionObject, [key, value]) => {
                        if (value !== "") {
                            competitionObject[key] = value;
                        }

                        return competitionObject;
                    },
                    {} as { [key: string]: any }
                ),
                rules: formData.rules,
                description: formData.description,
            })
        )
            .then((d) => {
                navigate(`/admin/competitions/${d.id}`);
                toast.success(`Created competition ${d.name}`);
            })
            .catch((err) => {
                toast.error("Error creating competition");
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
                    render={({ field }) => <PrizeEdit label="Prizes (optional)" {...field} className="mb-6" />}
                />

                {[Genre.OTHER, Genre.CREATIVE].includes(Number(activeCategory)) ? (
                    <>
                        <Controller
                            control={control}
                            name="fileupload"
                            defaultValue={[]}
                            render={({ field }) => <FileEdit {...field} label="Upload files (optional)" />}
                        />
                        <Controller
                            control={control}
                            name="vote_time_start"
                            render={({ field }) => {
                                const { value, ...props } = field;
                                return (
                                    <>
                                        <label
                                            id="votetime-start"
                                            className="mb-1 mt-6 block"
                                            htmlFor="vote_time_start"
                                        >
                                            Vote start time (optional)
                                        </label>
                                        <div className="block">
                                            <DatePicker
                                                ariaLabelledBy={"votetime-start"}
                                                selected={value}
                                                {...props}
                                                timeInputLabel="Time:"
                                                dateFormat="yyyy-MM-dd HH:mm"
                                                className={`unicorn-input mb-6 block h-12 rounded bg-white px-4 leading-tight text-gray-700 shadow focus:border-gray-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900`}
                                                showTimeInput
                                            />
                                        </div>
                                    </>
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name="vote_time_end"
                            render={({ field }) => {
                                const { value, ...props } = field;
                                return (
                                    <>
                                        <label id="votetime-end" className="mb-1" htmlFor="vote_time_end">
                                            Vote end time (optional)
                                        </label>
                                        <div className="block">
                                            <DatePicker
                                                ariaLabelledBy={"votetime-end"}
                                                selected={value}
                                                {...props}
                                                timeInputLabel="Time:"
                                                dateFormat="yyyy-MM-dd HH:mm"
                                                className={`unicorn-input mb-6 block h-12 rounded bg-white px-4 leading-tight text-gray-700 shadow focus:border-gray-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900`}
                                                showTimeInput
                                            />
                                        </div>
                                    </>
                                );
                            }}
                        />
                        <Input
                            type="number"
                            label="Minimum team size (optional)"
                            {...register("team_min")}
                            className="mb-6"
                        />
                        <Input
                            type="number"
                            label="Maximum team size (optional)"
                            {...register("team_max")}
                            className="mb-6"
                        />
                        <Input
                            label="Custom input field name (optional)"
                            {...register("contributor_extra")}
                            className="mb-6"
                        />
                    </>
                ) : (
                    <>
                        <Input
                            type="number"
                            label="Minimum team size (optional)"
                            {...register("team_min")}
                            className="mb-6"
                        />
                        <Input
                            type="number"
                            label="Maximum team size (optional)"
                            {...register("team_max")}
                            className="mb-6"
                        />
                        <Input
                            label="Custom input field name (optional)"
                            {...register("contributor_extra")}
                            className="mb-6"
                        />

                        <label className="mb-6 block">
                            <input {...register("report_win_loss")} type="checkbox" className="mr-2" />
                            Users can report win/loss (optional)
                        </label>
                    </>
                )}

                <Controller
                    control={control}
                    name="register_time_start"
                    render={({ field }) => {
                        const { value, ...props } = field;
                        return (
                            <>
                                <label id="register-end" className="mb-1" htmlFor="register_time_start">
                                    Registration start time (optional)
                                </label>
                                <div className="block">
                                    <DatePicker
                                        ariaLabelledBy={"register-end"}
                                        selected={value}
                                        {...props}
                                        timeInputLabel="Time:"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        className={`unicorn-input mb-6 block h-12 rounded bg-white px-4 leading-tight text-gray-700 shadow focus:border-gray-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900`}
                                        showTimeInput
                                    />
                                </div>
                            </>
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="register_time_end"
                    render={({ field }) => {
                        const { value, ...props } = field;
                        return (
                            <>
                                <label id="register-end" className="mb-1" htmlFor="register_time_end">
                                    Registration end time (optional)
                                </label>
                                <div className="block">
                                    <DatePicker
                                        ariaLabelledBy={"register-end"}
                                        selected={value}
                                        {...props}
                                        timeInputLabel="Time:"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        className={`unicorn-input mb-6 block h-12 rounded bg-white px-4 leading-tight text-gray-700 shadow focus:border-gray-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900`}
                                        showTimeInput
                                    />
                                </div>
                            </>
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="show_prestart_lock"
                    render={({ field }) => {
                        const { value, ...props } = field;
                        return (
                            <>
                                <label id="showtime-lock" className="mb-1 block" htmlFor="show_prestart_lock">
                                    Pre-show lockdown start (optional)
                                </label>
                                <div className="block">
                                    <DatePicker
                                        ariaLabelledBy={"showtime-lock"}
                                        selected={value}
                                        {...props}
                                        timeInputLabel="Time:"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        className={`unicorn-input mb-6 block h-12 rounded bg-white px-4 leading-tight text-gray-700 shadow focus:border-gray-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900`}
                                        showTimeInput
                                    />
                                </div>
                            </>
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="show_time_start"
                    render={({ field }) => {
                        const { value, ...props } = field;
                        return (
                            <>
                                <label id="showtime-end" className="mb-1 block" htmlFor="show_time_start">
                                    Competition show start time (optional)
                                </label>
                                <div className="block">
                                    <DatePicker
                                        ariaLabelledBy={"showtime-end"}
                                        selected={value}
                                        {...props}
                                        timeInputLabel="Time:"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        className={`unicorn-input mb-6 block h-12 rounded bg-white px-4 leading-tight text-gray-700 shadow focus:border-gray-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900`}
                                        showTimeInput
                                    />
                                </div>
                            </>
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="show_time_end"
                    render={({ field }) => {
                        const { value, ...props } = field;
                        return (
                            <>
                                <label id="showtime-end" className="mb-1 block" htmlFor="show_time_end">
                                    Competition show end time (optional)
                                </label>
                                <div className="block">
                                    <DatePicker
                                        ariaLabelledBy={"showtime-end"}
                                        selected={value}
                                        {...props}
                                        timeInputLabel="Time:"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        className={`unicorn-input mb-6 block h-12 rounded bg-white px-4 leading-tight text-gray-700 shadow focus:border-gray-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900`}
                                        showTimeInput
                                    />
                                </div>
                            </>
                        );
                    }}
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
                    {...register("participant_limit")}
                    className="mb-6"
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
                    render={({ field }) => {
                        return (
                            <Select
                                label="Visibility"
                                options={[
                                    {
                                        label: "Public",
                                        value: "public",
                                    },
                                    {
                                        label: "Crew",
                                        value: "crew",
                                    },
                                    {
                                        label: "Hidden",
                                        value: "hidden",
                                    },
                                ]}
                                {...field}
                            />
                        );
                    }}
                />

                <Controller
                    control={control}
                    defaultValue={[]}
                    name="links"
                    render={({ field }) => <CompetitionLinksEdit {...field} />}
                />

                <footer className="mt-8 flex flex-row-reverse justify-end">
                    <button className="ml-6 flex h-12 items-center justify-evenly rounded bg-green-300 px-4 text-base text-green-900 duration-150 hover:bg-green-700 hover:text-black hover:shadow">
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="flex h-12 items-center justify-evenly rounded bg-yellow-300 px-4 text-base text-yellow-900 duration-150 hover:bg-yellow-700 hover:text-black hover:shadow"
                    >
                        Previous
                    </button>
                </footer>
            </form>
        </>
    );
};
