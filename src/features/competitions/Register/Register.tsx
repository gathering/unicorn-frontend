import React, { useMemo } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import type { ICompetition } from '../competition.types';
import { httpPost } from '../../../utils/fetcher';
import { Input } from '../../../components/Input';
import { useForm, Controller } from 'react-hook-form';
import { hasFileupload, hasTeams } from '../../../utils/competitions';
import { useUserState } from '../../../context/Auth';

enum FormType {
    UPLOAD_TEAM,
    TEAM_ONLY,
    UPLOAD_ONLY,
}

interface IFormData {
    title: string;
    crew_msg?: string;
}

const HeadingWrapper = styled.h1`
    background: linear-gradient(5deg, #00000088 30%, #ffffff22 100%);
`;

interface IProps {
    competition: ICompetition;
    onRegistrationFinish: () => void;
}

export const Register = ({ competition, onRegistrationFinish }: IProps) => {
    const { user } = useUserState();
    const { register, handleSubmit, control, errors, reset } = useForm<IFormData>();

    const onSubmit = (formData: IFormData) => {
        if (!formData && !competition.rsvp) {
            return;
        }

        httpPost(
            'competitions/entries',
            JSON.stringify({
                competition: competition.id,
                ...formData,
            })
        )
            .then((d) => {
                toast.success('Successfully registered!');
                onRegistrationFinish();
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
            <RegistrationContainer
                headerImage={competition.header_image}
                name={competition.name}
                header={`Sign up for ${competition.name}`}
            >
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
                        onClick={() => onSubmit((null as unknown) as IFormData)}
                        className="items-center w-1/4 h-12 px-4 m-4 mb-6 text-base text-green-900 duration-150 bg-green-300 rounded mobile:w-full hover:bg-green-700 hover:text-black hover:shadow"
                    >
                        RSVP
                    </button>
                </div>
            </RegistrationContainer>
        );
    }

    return (
        <RegistrationContainer
            headerImage={competition.header_image}
            name={competition.name}
            header={`Sign up for ${competition.name}`}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex p-4">
                    <h3 style={{ width: '360px' }}>Registration</h3>
                    <fieldset className="flex-grow">
                        {registrationType === FormType.TEAM_ONLY ? (
                            <Input
                                fullWidth
                                name="title"
                                label="Team name"
                                ref={register({ required: 'You have to give your team a name' })}
                                errorLabel={errors.title?.message}
                            />
                        ) : registrationType === FormType.UPLOAD_TEAM ? (
                            <Controller
                                control={control}
                                name="title"
                                defaultValue=" by "
                                render={(props) => <UploadTeam {...props} />}
                            />
                        ) : (
                            <Input
                                fullWidth
                                name="title"
                                label="Entry title"
                                ref={register({ required: 'You have to give your entry a title' })}
                                errorLabel={errors.title?.message}
                            />
                        )}
                    </fieldset>
                </div>

                {competition.genre.category.value === 2 && (
                    <>
                        <hr className="my-6 border-t border-gray-300" />

                        <div className="flex p-4">
                            <h3 style={{ width: '360px' }}>Misc</h3>
                            <fieldset className="flex-grow">
                                <label htmlFor="display_name_field" className="block w-full mb-1">
                                    Display name
                                </label>
                                <span
                                    id="display_name_field"
                                    className="flex items-center h-12 px-4 mb-6 leading-tight text-gray-700 bg-gray-300 border border-gray-300 rounded"
                                >
                                    {user?.display_name}
                                </span>
                                <Input fullWidth name="crew_msg" label="Message to crew (optional)" ref={register()} />
                            </fieldset>
                        </div>
                    </>
                )}

                <hr className="my-6 border-t border-gray-300" />

                <button className="flex items-center float-right h-12 px-4 m-4 mb-6 text-base text-green-900 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow">
                    Register
                </button>
            </form>
        </RegistrationContainer>
    );
};

const UploadTeam = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    const title = useMemo(() => {
        return value.split(' by ')[0] || '';
    }, [value]);

    const team = useMemo(() => {
        return value.split(' by ')[1] || '';
    }, [value]);

    return (
        <>
            <Input
                fullWidth
                label="Entry title"
                className="mb-4"
                value={title}
                onChange={(e) => onChange(e.target.value + ' by ' + team)}
            />
            <Input
                fullWidth
                label="Team name"
                value={team}
                onChange={(e) => onChange(title + ' by ' + e.target.value)}
            />
        </>
    );
};

const RegistrationContainer: React.FC<{ name: string; headerImage: string; header: string }> = ({
    children,
    name,
    headerImage,
    header,
}) => (
    <div className="container mx-auto my-12 mobile:my-0">
        <div className="relative">
            <img className="object-cover w-full h-48 mb-4 rounded-md mobile:rounded-none" src={headerImage} alt="" />
            <HeadingWrapper className="absolute bottom-0 flex items-end w-full h-full px-4 pb-3 text-5xl rounded-md text-gray-50">
                {name}
            </HeadingWrapper>
        </div>
        <section className="flex flex-col bg-white rounded mobile:rounded-none">
            <h2 className="p-4 text-xl text-center">{header}</h2>
            <hr className="pb-6 border-t border-gray-300" />
            {children}
        </section>
    </div>
);
