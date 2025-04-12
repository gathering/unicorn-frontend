import { addHours, addWeeks } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea/Textarea";
import type { Genre } from "../competition";

interface IProps {
    onForward: () => void;
    onPrevious: () => void;
    activeCategory: Genre | null;
}

const initialDate = addHours(new Date(), 1);
initialDate.setMinutes(0, 0, 0);

export const GeneralSettings = ({ onForward, onPrevious }: IProps) => {
    const { register, formState, handleSubmit, control } = useFormContext();

    const onSubmit = () => {
        onForward();
    };

    return (
        <>
            <h1 className="mb-8 text-3xl dark:text-gray-100">General settings</h1>
            <p className="mb-10 text-gray-700 dark:text-gray-300">
                All of these inputs are mandatory. They are the base data for the competition. If you&apos;re not sure
                what to put into the fields yet, you may put in some dummy data for now. After creating the competition
                you may come back to edit the fields.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    {...register("name", { required: "You need to give the competition a title" })}
                    label="Competition title"
                    className="mb-6 w-full"
                    errorLabel={formState.errors.name?.message}
                />

                <Input
                    {...register("brief_description", {
                        required: "You need to give the competition a short teasing description",
                        maxLength: {
                            message: "The length is limited to 40 characters. This should only be a short tease",
                            value: 40,
                        },
                    })}
                    label="Brief description"
                    className="mb-6 w-full"
                    errorLabel={formState.errors.brief_description?.message}
                />

                <Controller
                    control={control}
                    name="run_time_start"
                    rules={{
                        required: "You must give the competition a start time",
                    }}
                    defaultValue={initialDate}
                    render={({ field }) => {
                        const { value, ...props } = field;
                        return (
                            <>
                                <label id="runtime-start" className="dark:text-gray-100" htmlFor="run_time_start">
                                    Competition start time
                                </label>
                                {formState.errors.run_time_start && (
                                    <label
                                        role="alert"
                                        className="block text-red-600 dark:text-red-400"
                                        id="description-error-label"
                                    >
                                        {String(formState.errors.run_time_start.message)}
                                    </label>
                                )}
                                <div className="block">
                                    <DatePicker
                                        ariaLabelledBy={"runtime-start"}
                                        selected={value}
                                        {...props}
                                        timeInputLabel="Time:"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        className={`mb-6 block h-12 rounded bg-white px-4 leading-tight text-gray-700 shadow focus:border-gray-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-900 ${
                                            formState.errors.run_time_start
                                                ? "text-red border border-red-600 focus:border-red-800 dark:border-red-400 dark:focus:border-red-600"
                                                : ""
                                        }`}
                                        showTimeInput
                                    />
                                </div>
                            </>
                        );
                    }}
                />

                <Controller
                    control={control}
                    name="run_time_end"
                    defaultValue={addWeeks(initialDate, 1)}
                    rules={{
                        required: "You must give the competition an end time",
                    }}
                    render={({ field }) => {
                        const { value, ...props } = field;
                        return (
                            <>
                                <label id="runtime-end" className="mt-6 dark:text-gray-100" htmlFor="run_time_end">
                                    Competition end time
                                </label>
                                {formState.errors.run_time_end && (
                                    <label
                                        role="alert"
                                        className="block text-red-600 dark:text-red-400"
                                        id="description-error-label"
                                    >
                                        {String(formState.errors.run_time_end.message)}
                                    </label>
                                )}
                                <div className="block">
                                    <DatePicker
                                        ariaLabelledBy={"runtime-end"}
                                        selected={value}
                                        {...props}
                                        timeInputLabel="Time:"
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        className={`mb-6 block h-12 rounded bg-white px-4 leading-tight text-gray-700 shadow focus:border-gray-500 focus:bg-white focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:focus:bg-gray-900 ${
                                            formState.errors.run_time_end
                                                ? "text-red border border-red-600 focus:border-red-800 dark:border-red-400 dark:focus:border-red-600"
                                                : ""
                                        }`}
                                        showTimeInput
                                    />
                                </div>
                            </>
                        );
                    }}
                />

                <Textarea
                    label="Competition description"
                    className="mb-6 w-full p-2"
                    rows={10}
                    errorLabel={formState.errors.description?.message}
                    {...register("description", {
                        required: "You must write a description for the competition",
                    })}
                ></Textarea>

                <Textarea
                    className="mb-6 w-full p-2"
                    rows={20}
                    label="Competition rules"
                    errorLabel={formState.errors.rules?.message}
                    {...register("rules", {
                        required: "You must write a ruleset for the competition",
                    })}
                ></Textarea>

                <Input
                    label="Poster image URL"
                    type="url"
                    {...register("header_image", { required: "You must add a poster for the competition" })}
                    errorLabel={formState.errors.header_image?.message}
                    className="mb-6 w-full"
                />

                <Input
                    label="Poster image credits"
                    {...register("header_credit", {
                        required: "You must credit the poster",
                    })}
                    errorLabel={formState.errors.header_credit?.message}
                    className="w-full"
                />

                <footer className="mt-8 flex flex-row-reverse justify-end">
                    <button className="ml-6 flex h-12 items-center justify-evenly rounded bg-green-300 px-4 text-base text-green-800 duration-150 hover:bg-green-700 hover:text-black hover:shadow dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-500">
                        Next
                    </button>
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="flex h-12 items-center justify-evenly rounded bg-yellow-300 px-4 text-base text-yellow-900 duration-150 hover:bg-yellow-700 hover:text-black hover:shadow dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-500"
                    >
                        Previous
                    </button>
                </footer>
            </form>
        </>
    );
};
