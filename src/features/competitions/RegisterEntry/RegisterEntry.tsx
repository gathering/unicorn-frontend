import React, { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import type { ICompetition, IEntry } from "../competition";
import { httpPost } from "../../../utils/fetcher";
import { Input } from "../../../components/Input";
import { useForm, Controller } from "react-hook-form";
import { hasFileupload, hasTeams } from "../../../utils/competitions";
import { useUserState } from "../../../context/Auth";
import { Link } from "../../../components/Link";

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
    }, [defaultValues]);

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
                        className="items-center w-1/4 h-12 px-4 m-4 mb-6 text-base text-green-900 duration-150 bg-green-300 rounded sm:w-full hover:bg-green-700 hover:text-black hover:shadow"
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
                    <fieldset className="flex-grow">
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
                                <fieldset className="flex-grow">
                                    <label htmlFor="display_name_field" className="block w-full mb-1">
                                        Display name
                                    </label>
                                    <span
                                        id="display_name_field"
                                        className="flex items-center h-12 px-4 mb-2 leading-tight text-gray-700 bg-gray-300 border border-gray-300 rounded"
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

                <button className="flex items-center float-right h-12 px-4 m-4 mb-6 text-base text-green-900 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow">
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
        <section className="flex flex-col bg-white rounded dark:bg-gray-800 sm:rounded-none">
            <h2 className="p-4 text-xl text-center">{header}</h2>
            <hr className="pb-6 border-t border-gray-300 dark:borger-gray-700" />
            {children}
        </section>
    </div>
);
