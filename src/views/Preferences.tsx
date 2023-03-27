import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import { toast } from "react-toastify";
import { useUserState } from "../context/Auth";
import { View } from "../components/View";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { httpGet, httpPatch } from "../utils/fetcher";
import { parseError } from "../utils/error";
import { Link } from "../components/Link";

interface FormData {
    display_name_format: string;
    username: string;
}

interface AccountChoicesResponse {
    "user:display_name_format": {
        value: string;
        label: string;
    }[];
}

const Preferences = () => {
    const { data: accountChoices } = useSWR<AccountChoicesResponse>("accounts/_choices", httpGet);

    const { user, revalidateUser } = useUserState();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        control,
        watch,
    } = useForm<FormData>();

    const chosenFormat = watch("display_name_format");

    useEffect(() => {
        if (user) {
            reset({
                display_name_format: user.display_name_format.value,
                username: user.username,
            });
        }
    }, [user, reset]);

    const selectOptions = useMemo(() => {
        const none = { label: "Select display name format", value: "__default_value__" };

        if (!accountChoices) {
            return [none];
        }

        if (!chosenFormat) {
            return [none, ...(accountChoices?.["user:display_name_format"] ?? [])];
        }

        return accountChoices?.["user:display_name_format"] ?? [];
    }, [accountChoices]);

    const onSubmit = (formData: FormData) => {
        if (!user) {
            return;
        }

        httpPatch(`accounts/users/${user.uuid}`, JSON.stringify(formData))
            .then(() => {
                revalidateUser();
                toast.success("Saved!");
            })
            .catch((err) => {
                parseError(err).forEach((e: any) => toast.error(e));
            });
    };

    return (
        <View className="container mx-auto mt-10">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="px-4 py-6 bg-white rounded-md shadow-md dark:bg-gray-800 max-w-prose"
            >
                <fieldset>
                    <legend className="mb-4 text-xl">How do you want to be presented?</legend>
                    <Input
                        label="Nick"
                        {...register("username", {
                            required: "You have to choose a nick name",
                        })}
                        errorLabel={errors.username?.message}
                        className="mb-4"
                    />
                    <Controller
                        control={control}
                        name="display_name_format"
                        defaultValue="__default_value__"
                        rules={{ validate: (v) => v !== "__default_value__" || "You must select a genre" }}
                        render={({ field }) => (
                            <>
                                <Select
                                    label="Display format"
                                    options={selectOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                />

                                {errors.display_name_format?.message && (
                                    <label className="flex items-center mt-1 text-red-600">
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
                                        {errors.display_name_format?.message}
                                    </label>
                                )}
                            </>
                        )}
                    />
                </fieldset>
                <footer className="flex items-end justify-between max-w-prose">
                    <button className="flex items-center h-12 px-4 mt-8 text-base text-green-900 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow">
                        Save
                    </button>
                    <Link to="/">Back</Link>
                </footer>
            </form>
        </View>
    );
};

export default Preferences;
