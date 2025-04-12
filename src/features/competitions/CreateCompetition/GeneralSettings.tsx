import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import { addHours, addWeeks } from "date-fns";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "../../../components/Input";
import type { Genre } from "../competition";
import { Textarea } from "../../../components/Textarea/Textarea";

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
                All of these inputs are mandatory. They are the base data for the competition. If you're not sure what
                to put into the fields yet, you may put in some dummy data for now. After creating the competition you
                may come back to edit the fields.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                    {...register("name", { required: "You need to give the competition a title" })}
                    label="Competition title"
                    className="w-full mb-6"
                    errorLabel={String(formState.errors.name?.message)}
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
                    className="w-full mb-6"
                    errorLabel={String(formState.errors.brief_description?.message)}
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
                                        className={`block px-4 h-12 mb-6 leading-tight text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded shadow focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-gray-500 ${
                                            formState.errors.run_time_start
                                                ? "text-red border-red-600 dark:border-red-400 focus:border-red-800 dark:focus:border-red-600 border"
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
                                        className={`block px-4 h-12 mb-6 leading-tight text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded shadow focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-gray-500 ${
                                            formState.errors.run_time_end
                                                ? "text-red border-red-600 dark:border-red-400 focus:border-red-800 dark:focus:border-red-600 border"
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
                    className="w-full mb-6 p-2"
                    rows={10}
                    errorLabel={String(formState.errors.description?.message)}
                    {...register("description", {
                        required: "You must write a description for the competition",
                    })}
                ></Textarea>

                <Textarea
                    className="w-full mb-6 p-2"
                    rows={20}
                    label="Competition rules"
                    errorLabel={String(formState.errors.rules?.message)}
                    {...register("rules", {
                        required: "You must write a ruleset for the competition",
                    })}
                ></Textarea>

                <Input
                    label="Poster image URL"
                    type="url"
                    {...register("header_image", { required: "You must add a poster for the competition" })}
                    errorLabel={String(formState.errors.header_image?.message)}
                    className="w-full mb-6"
                />

                <Input
                    label="Poster image credits"
                    {...register("header_credit", {
                        required: "You must credit the poster",
                    })}
                    errorLabel={String(formState.errors.header_credit?.message)}
                    className="w-full"
                />

                <footer className="flex flex-row-reverse justify-end mt-8">
                    <button className="flex items-center h-12 px-4 ml-6 text-base text-green-800 duration-150 bg-green-300 rounded dark:text-green-200 dark:bg-green-800 justify-evenly hover:bg-green-700 dark:hover:bg-green-500 hover:text-black hover:shadow">
                        Next
                    </button>
                    <button
                        type="button"
                        onClick={onPrevious}
                        className="flex items-center h-12 px-4 text-base text-yellow-900 duration-150 bg-yellow-300 rounded dark:text-yellow-200 dark:bg-yellow-800 justify-evenly hover:bg-yellow-700 dark:hover:bg-yellow-500 hover:text-black hover:shadow"
                    >
                        Previous
                    </button>
                </footer>
            </form>
        </>
    );
};
