import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { Input } from '../components/Input';
import type { ICompetition, IEntry } from '../features/competitions/competition.types';
import { amIParticipant, hasFileupload, hasTeams } from '../utils/competitions';
import { httpGet, httpPost, httpPut } from '../utils/fetcher';

enum FormType {
    UPLOAD_TEAM,
    TEAM_ONLY,
    UPLOAD_ONLY,
}

interface IFormData {
    title: string;
    crew_msg?: string;
}

// TODO Resign

const CompetitionRegisterEntry = () => {
    const { pathname } = useLocation();
    const { id, entryId } = useParams<{ id: string; entryId?: string }>();
    const { register, handleSubmit, control, errors, reset } = useForm<IFormData>();
    const { data, mutate: refetchCompetition } = useSWR<ICompetition>('competitions/competitions/' + id, httpGet);

    const hasEntry = useMemo(() => (data ? amIParticipant(data) : false), [data]);

    const { data: entry, mutate: refetchEntry } = useSWR<IEntry>(hasEntry ? hasEntry.url : null, httpGet);

    useEffect(() => {
        if (hasEntry && entry) {
            reset({
                title: entry?.title,
                crew_msg: entry?.crew_msg,
            });
        }
    }, [hasEntry, entry]);

    const registrationType = useMemo(() => {
        if (!data) {
            return null;
        }

        const team = hasTeams(data);
        const upload = hasFileupload(data);

        if (team && upload) {
            return FormType.UPLOAD_TEAM;
        } else if (team) {
            return FormType.TEAM_ONLY;
        } else if (upload) {
            return FormType.UPLOAD_ONLY;
        } else {
            return null;
        }
    }, [data]);

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="text-6xl animate-bounce"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                    />
                </svg>
                <h1 className="pt-4 text-2xl">Fetching data...</h1>
            </div>
        );
    }

    const onSubmit = (formData: IFormData) => {
        if (!formData && !data.rsvp) {
            return;
        }

        if (entry?.id) {
            httpPut(
                `competitions/entries/${entry.id}`,
                JSON.stringify({
                    competition: data.id,
                    ...formData,
                })
            )
                .then((d) => {
                    toast.success('Saved changes!');
                    refetchEntry();
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
        } else {
            httpPost(
                'competitions/entries',
                JSON.stringify({
                    competition: data.id,
                    ...formData,
                })
            )
                .then((d) => {
                    toast.success('Successfully registered!');
                    refetchCompetition();
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

    const header = entry ? entry.title : `Sign up for ${data.name}`;

    if (data.rsvp) {
        return (
            <RegisterContainer headerImage={data.header_image} name={data.name} header={header}>
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
            </RegisterContainer>
        );
    }

    return (
        <RegisterContainer headerImage={data.header_image} name={data.name} header={header}>
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

                {data.genre.category.value === 2 && (
                    <>
                        <hr className="my-6 border-t border-gray-300" />

                        <div className="flex p-4">
                            <h3 style={{ width: '360px' }}>Misc</h3>
                            <fieldset className="flex-grow">
                                <Input fullWidth name="crew_msg" label="Message to crew (optional)" ref={register()} />
                            </fieldset>
                        </div>
                    </>
                )}

                <hr className="my-6 border-t border-gray-300" />

                <button className="flex items-center float-right h-12 px-4 m-4 mb-6 text-base text-green-900 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow">
                    {hasEntry ? 'Save' : 'Register'}
                </button>
            </form>
        </RegisterContainer>
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

const RegisterContainer: React.FC<{ name: string; headerImage: string; header: string }> = ({
    children,
    name,
    headerImage,
    header,
}) => (
    <div className="container mx-auto my-12 mobile:my-0">
        <div className="relative">
            <img className="object-cover w-full h-48 mb-4 rounded-md mobile:rounded-none" src={headerImage} alt="" />
            <h1 className="absolute bottom-0 w-full px-4 text-5xl text-white bg-black bg-opacity-75 rounded-b-md mobile:rounded-none">
                {name}
            </h1>
        </div>
        <section className="flex flex-col bg-white rounded mobile:rounded-none">
            <h2 className="p-4 text-xl text-center">{header}</h2>
            <hr className="pb-6 border-t border-gray-300" />
            {children}
        </section>
    </div>
);

export default CompetitionRegisterEntry;
