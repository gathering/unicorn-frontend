import React, { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Input } from "../../../components/Input";
import { Link } from "../../../components/Link";
import { useUserState } from "../../../context/Auth";
import { hasFileupload, hasTeams } from "../../../utils/competitions";
import { httpPost } from "../../../utils/fetcher";
import type { ICompetition, IEntry } from "../competition";

enum FormType {
    UPLOAD_TEAM,
    TEAM_ONLY,
    UPLOAD_ONLY,
}

interface IFormData {
    title: string;
    crew_msg?: string;
}

interface IProps {
    competition: ICompetition;
    onRegistrationFinish?: () => void;
    defaultValues?: IFormData;
    onSubmit?: (data: IFormData) => void;
    exists?: boolean;
}

export const RegisterEntry = ({
    competition,
    onRegistrationFinish,
    defaultValues,
    onSubmit,
    exists = false,
}: IProps) => {
    const { user } = useUserState();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<IFormData>({
        defaultValues: defaultValues ?? {},
        shouldUnregister: false,
    });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const onUpdate = (formData: IFormData) => {
        if (!formData && !competition.rsvp) {
            return;
        }

        if (onSubmit) {
            onSubmit(formData);
            return;
        }

        if (!defaultValues) {
            httpPost<IEntry>(
                "competitions/entries",
                JSON.stringify({
                    competition: competition.id,
                    ...formData,
                })
            )
                .then(() => {
                    toast.success("Successfully registered!");
                    onRegistrationFinish?.();
                })
                .catch((error) => {
                    const errorList = Object.entries(error.body).map(([key, val]) => {
                        if (Array.isArray(val)) {
                            return `${key}: ${val[0]}`;
                        }

                        return `${key}: ${val}`;
                    });

                    for (const e of errorList) {
                        toast.error(e);
                    }
                });
        }
    };

    const registrationType = useMemo(() => {
        if (!competition) {
            return null;
        }

        const team = hasTeams(competition);
        const upload = hasFileupload(competition);

        if (team && upload) {
            return FormType.UPLOAD_TEAM;
        } else if (team) {
            return FormType.TEAM_ONLY;
        } else if (upload) {
            return FormType.UPLOAD_ONLY;
        } else {
            return null;
        }
    }, [competition]);

    if (competition.rsvp) {
        return (
            <RegistrationContainer header={`${defaultValues ? "Update" : "Sign up for"} ${competition.name}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="m-8 text-6xl text-teal-400"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                </svg>
                <div className="flex justify-center">
                    <button
                        onClick={() => onUpdate(null as unknown as IFormData)}
                        className="m-4 mb-6 h-12 w-1/4 items-center rounded-sm bg-green-300 px-4 text-base text-green-900 duration-150 hover:bg-green-700 hover:text-black hover:shadow-sm sm:w-full"
                    >
                        RSVP
                    </button>
                </div>
            </RegistrationContainer>
        );
    }

    return (
        <RegistrationContainer header={`${defaultValues ? "Update" : "Sign up for"} ${competition.name}`}>
            <form onSubmit={handleSubmit(onUpdate)}>
                <div className="flex p-4">
                    <h3 style={{ width: "360px" }}>Registration</h3>
                    <fieldset className="grow">
                        {registrationType === FormType.TEAM_ONLY ? (
                            <Input
                                fullWidth
                                {...register("title", { required: "You have to give your team a name" })}
                                label="Team name"
                                errorLabel={errors.title?.message}
                            />
                        ) : registrationType === FormType.UPLOAD_TEAM ? (
                            <Controller
                                control={control}
                                name="title"
                                defaultValue=" by "
                                render={({ field }) => <UploadTeam onChange={field.onChange} value={field.value} />}
                            />
                        ) : (
                            <>
                                <Input
                                    fullWidth
                                    {...register("title", { required: "You have to give your entry a title" })}
                                    label="Entry Title"
                                    errorLabel={errors.title?.message}
                                />
                                {!exists && (
                                    <p className="pt-2 text-gray-700 dark:text-gray-100">
                                        After giving your entry a title and clicking Register, you will be able to
                                        upload any required files for the competition.
                                    </p>
                                )}
                            </>
                        )}
                    </fieldset>
                </div>

                {/* Don't show this field if it is a team competition */}
                {competition.genre.category.value === 2 &&
                    registrationType !== FormType.UPLOAD_TEAM &&
                    registrationType !== FormType.TEAM_ONLY && (
                        <>
                            <hr className="my-6 border-t border-gray-300" />

                            <div className="flex p-4">
                                <h3 style={{ width: "360px" }}>Misc</h3>
                                <fieldset className="grow">
                                    <label htmlFor="display_name_field" className="mb-1 block w-full">
                                        Display name
                                    </label>
                                    <span
                                        id="display_name_field"
                                        className="mb-2 flex h-12 items-center rounded-sm border border-gray-300 bg-gray-300 px-4 leading-tight text-gray-700"
                                    >
                                        {user?.display_name}
                                    </span>
                                    <p className="mb-6 font-light">
                                        Not happy with your display name? Change it{" "}
                                        <Link inline to="/preferences">
                                            here
                                        </Link>
                                        .
                                    </p>
                                    <Input fullWidth {...register("crew_msg")} label="Message to crew (optional)" />
                                </fieldset>
                            </div>
                        </>
                    )}

                <hr className="my-6 border-t border-gray-300" />

                <button className="float-right m-4 mb-6 flex h-12 items-center justify-evenly rounded-sm bg-green-300 px-4 text-base text-green-900 duration-150 hover:bg-green-700 hover:text-black hover:shadow-sm">
                    {defaultValues ? "Update" : "Register"}
                </button>
            </form>
        </RegistrationContainer>
    );
};

const UploadTeam = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    const title = useMemo(() => {
        return value.split(" by ")[0] || "";
    }, [value]);

    const team = useMemo(() => {
        return value.split(" by ")[1] || "";
    }, [value]);

    return (
        <>
            <Input
                fullWidth
                label="Entry title"
                className="mb-4"
                value={title}
                onChange={(e) => onChange(e.target.value + " by " + team)}
            />
            <Input
                fullWidth
                label="Team name"
                value={team}
                onChange={(e) => onChange(title + " by " + e.target.value)}
            />
        </>
    );
};

const RegistrationContainer: React.FC<React.PropsWithChildren<{ header: string }>> = ({ children, header }) => (
    <div className="container mx-auto my-12 sm:my-0">
        <section className="flex flex-col rounded-sm bg-white sm:rounded-none dark:bg-gray-800">
            <h2 className="p-4 text-center text-xl">{header}</h2>
            <hr className="dark:borger-gray-700 border-t border-gray-300 pb-6" />
            {children}
        </section>
    </div>
);
