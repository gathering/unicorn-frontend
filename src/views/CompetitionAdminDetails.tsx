import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import useSWR from 'swr';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import type { ICompetition, IEntryListResponse } from '../features/competitions/competition';
import { useUserState } from '../context/Auth';
import { httpDelete, httpGet, httpPatch } from '../utils/fetcher';
import { View } from '../components/View';
import { Link } from '../components/Link';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { parseError } from '../utils/error';
import { AnimatePresence, motion } from 'framer-motion';
import { hasPermission, Permission } from '../utils/permissions';

const HeadingWrapper = styled.h1`
    background: linear-gradient(5deg, #00000088 30%, #ffffff22 100%);
`;

const entryStateColors = [
    {
        value: 1,
        label: 'Draft',
        bg: 'text-yellow-400',
    },
    {
        value: 2,
        label: 'New',
        bg: 'text-yellow-400',
    },
    {
        value: 4,
        label: 'Qualified',
        bg: 'text-green-400',
    },
    {
        value: 8,
        label: 'Disqualified',
        bg: 'text-red-400',
    },
    {
        value: 16,
        label: 'Not preselected',
        bg: 'text-red-400',
    },
    {
        value: 32,
        label: 'Invalid file',
        bg: 'text-yellow-400',
    },
];

const CompetitionAdminDetails = () => {
    const history = useHistory();
    const { id } = useParams<{ id: string }>();
    const { data, mutate } = useSWR<ICompetition>('competitions/competitions/' + id, httpGet);
    const [isUpdatingPublished, setIsUpdatingPublished] = useState<string>();
    const [validateDelete, setValidateDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { data: entries } = useSWR<IEntryListResponse>(
        `competitions/entries/?competition_id=${id}&limit=1000`,
        httpGet
    );

    const updatePublished = (published?: boolean) => {
        if (!data) {
            return;
        }

        setIsUpdatingPublished('Processing');

        httpPatch<ICompetition>(
            `competitions/competitions/${data.id}`,
            JSON.stringify({ published: published ?? !data.published })
        )
            .then((d) => {
                mutate({ ...data, ...d });
                setIsUpdatingPublished(undefined);
            })
            .catch((err) => {
                parseError(err).forEach((e: any) => toast.error(e));
                setIsUpdatingPublished(undefined);
            });
    };

    const deleteCompetition = () => {
        if (!data) {
            return;
        }

        setIsDeleting(true);
        httpDelete(`competitions/competitions/${data.id}`)
            .then(() => {
                toast.success('Deleted competition');
                history.push('/admin/competitions');
            })
            .catch((err) => {
                parseError(err).forEach((e: any) => toast.error(e));
                setIsDeleting(false);
            });
    };

    if (!data) {
        return null;
    }

    return (
        <View className="container grid grid-cols-3 gap-4 mx-auto my-12 sm:my-0">
            <header className="relative w-full h-48 col-span-3 mb-6">
                <img className="object-cover w-full h-48 rounded-md sm:rounded-none" src={data.header_image} alt="" />
                <HeadingWrapper className="absolute bottom-0 flex items-end w-full h-full px-4 pb-3 text-5xl rounded-md sm:rounded-none text-gray-50">
                    {data.name}
                </HeadingWrapper>
            </header>
            <section className="grid w-full grid-cols-3 col-span-2 gap-4 auto-rows-min">
                {/* <Input placeholder="Search" aria-label="Search for participant" /> */}
                <ul className="flex items-end justify-end col-span-3 gap-4 mr-4">
                    <li className="flex items-center gap-1">
                        <svg
                            className="text-green-400"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="7" cy="7" r="7" fill="currentColor" />
                        </svg>
                        Qualified
                    </li>
                    <li className="flex items-center gap-1">
                        <svg
                            className="text-yellow-400"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="7" cy="7" r="7" fill="currentColor" />
                        </svg>
                        Not handled
                    </li>
                    <li className="flex items-center gap-1">
                        <svg
                            className="text-red-400"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="7" cy="7" r="7" fill="currentColor" />
                        </svg>
                        Disqualified
                    </li>
                </ul>
                <div className="col-span-3 p-4 bg-white rounded shadow sm:rounded-none">
                    <h2 className="pb-4 text-xl">
                        Participants
                        <Link to={`/admin/competitions/${id}/results`} className="float-right text-base">
                            Results
                        </Link>
                    </h2>

                    {entries?.results.length > 0 ? (
                        <ul className="pb-4">
                            {entries?.results.map((e, i) => (
                                <li key={e.id} className="flex flex-wrap items-end my-3">
                                    <section className="flex-1">
                                        <h3 className="pb-4 font-medium">{e.title}</h3>
                                        <p className="font-light">{e.owner?.display_name}</p>
                                    </section>
                                    <span title={entryStateColors.find((c) => c.value === e.status.value)?.label}>
                                        <svg
                                            className={`${
                                                entryStateColors.find((c) => c.value === e.status.value)?.bg
                                            } mb-1 mr-4`}
                                            width="14"
                                            height="14"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle cx="7" cy="7" r="7" fill="currentColor" />
                                        </svg>
                                    </span>

                                    <Link to={`/admin/competitions/${id}/${e.id}`} className="ml-4 -mb-1">
                                        More information
                                    </Link>
                                    {i < entries.results.length - 1 && (
                                        <hr className="w-full my-6 border-t border-gray-300" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="pb-4">No available participants in this competition</p>
                    )}

                    <Link to="/admin/competitions" className="-ml-1">
                        Back to competition list
                    </Link>

                    <Link to={`/admin/competitions/${id}/results`} className="ml-10">
                        Results
                    </Link>
                </div>
            </section>
            <aside>
                <section className="mb-4 bg-white rounded shadow sm-rounded-none">
                    <h2 className="px-4 py-6 text-xl">{data.entries_count} registered</h2>
                </section>
                <section className="mb-4 bg-white rounded shadow sm:rounded-none">
                    <h2 className="p-4 text-xl pb-7">Quick settings</h2>
                    {hasPermission(Permission.CompetitionsChangeCompetition, data.permissions) ? (
                        <ul>
                            <li className="flex flex-wrap items-end pb-6">
                                <section className="flex-1 px-4 text-sm">
                                    <h3 className="font-semibold">Publish status</h3>
                                    {data.published ? <p>Published</p> : <p className="text-red-500">Not published</p>}
                                </section>

                                <Button loading={isUpdatingPublished} onClick={() => updatePublished()}>
                                    {data.published ? 'Hide' : 'Publish'}
                                </Button>

                                {/* <hr className="w-full my-6 border-t border-gray-300" /> */}
                            </li>
                            {/* <li className="flex flex-wrap items-end pb-4">
                            <section className="flex-1 px-4 text-sm">
                                <h3 className="font-semibold">Start time</h3>
                                {data.published ? <p>Published</p> : <p className="text-red-500">Not published</p>}
                            </section>

                            <button className="p-1 px-2 mx-4 text-indigo-700 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200">
                                Change
                            </button>
                        </li> */}
                        </ul>
                    ) : (
                        <p className="px-4 pb-6">You do not have access to any settings in this competition.</p>
                    )}
                </section>

                {hasPermission(Permission.CompetitionsDeleteCompetition, data.permissions) && (
                    <section>
                        <h2 className="sr-only">Danger zone</h2>
                        <AnimatePresence initial={false} exitBeforeEnter>
                            {validateDelete ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key="on"
                                    className="flex flex-wrap"
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg
                                                className="w-full h-5 my-4 text-center text-red-800 animate-bounce"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            <p className="w-full">Are you sure you want to delete {data.name}?</p>
                                            <Button onClick={() => deleteCompetition()}>Yes</Button>
                                            <Button onClick={() => setValidateDelete(false)}>No</Button>
                                        </>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key="off"
                                >
                                    <button
                                        onClick={() => setValidateDelete(true)}
                                        className="float-right px-8 py-3 text-white transition-all duration-150 bg-red-400 rounded-lg hover:bg-red-900"
                                    >
                                        Delete
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                )}
            </aside>
        </View>
    );
};

export default CompetitionAdminDetails;
