import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useSWR from "swr";
import { Input } from "../components/Input";
import { Link } from "../components/Link";
import { Select } from "../components/Select";
import { View } from "../components/View";
import { useUserState } from "../context/Auth";
import { parseError } from "../utils/error";
import { httpOptions, httpPatch } from "../utils/fetcher";

interface FormData {
    display_name_format: string;
    username: string;
}

interface UserOptionsResponse {
    actions: {
        POST: {
            display_name_format: {
                choices: {
                    value: string;
                    display_name: string;
                }[];
            };
        };
    };
}

const Preferences = () => {
    const { data: accountChoices } = useSWR<UserOptionsResponse>("accounts/users", httpOptions);

    const { user, revalidateUser } = useUserState();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        control,
        watch,
    } = useForm<FormData>();

    // eslint-disable-next-line react-hooks/incompatible-library
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
        const none = { display_name: "Select display name format", value: "__default_value__" };

        if (!accountChoices) {
            return [none];
        }

        if (!chosenFormat) {
            return [none, ...(accountChoices?.actions.POST.display_name_format.choices ?? [])];
        }

        return accountChoices?.actions.POST.display_name_format.choices ?? [];
    }, [accountChoices, chosenFormat]);

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
                className="max-w-prose rounded-md bg-white px-4 py-6 shadow-md dark:bg-gray-800"
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
                                    options={selectOptions.map((opt) => ({
                                        value: opt.value,
                                        label: opt.display_name,
                                    }))}
                                    value={field.value}
                                    onChange={field.onChange}
                                />

                                {errors.display_name_format?.message && (
                                    <label className="mt-1 flex items-center text-red-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            className="mr-4 h-4 w-4"
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
                <footer className="flex max-w-prose items-end justify-between">
                    <button className="mt-8 flex h-12 items-center justify-evenly rounded bg-green-300 px-4 text-base text-green-900 duration-150 hover:bg-green-700 hover:text-black hover:shadow">
                        Save
                    </button>
                    <Link to="/">Back</Link>
                </footer>
            </form>
        </View>
    );
};

export default Preferences;
