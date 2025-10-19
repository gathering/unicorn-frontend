import { hasPermission, Permission } from "@/utils/permissions";
import { Button } from "@components/Button";
import { Link } from "@components/Link";
import { View } from "@components/View";
import type { ICompetition, IEntryListResponse } from "@features/competitions/competition";
import { parseError } from "@utils/error";
import { httpDelete, httpGet, httpPatch } from "@utils/fetcher";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";

const HeadingWrapper = styled.h1`
    background: linear-gradient(5deg, #00000088 30%, #ffffff22 100%);
`;

const entryStateColors = [
    {
        value: 1,
        label: "Draft",
        bg: "text-yellow-400 dark:text-yellow-600",
    },
    {
        value: 2,
        label: "New",
        bg: "text-yellow-400 dark:text-yellow-600",
    },
    {
        value: 4,
        label: "Qualified",
        bg: "text-green-400 dark:text-green-600",
    },
    {
        value: 8,
        label: "Disqualified",
        bg: "text-red-400 dark:text-red-600",
    },
    {
        value: 16,
        label: "Not preselected",
        bg: "text-red-400 dark:text-red-600",
    },
    {
        value: 32,
        label: "Invalid file",
        bg: "text-yellow-400 dark:text-yellow-600",
    },
];

const CompetitionAdminDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data, mutate } = useSWR<ICompetition>("competitions/competitions/" + id, httpGet);
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

        setIsUpdatingPublished("Processing");

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
                toast.success("Deleted competition");
                navigate("/admin/competitions");
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
        <View className="container mx-auto my-12 grid grid-cols-3 gap-4 sm:my-0">
            <header className="relative col-span-3 mb-6 h-48 w-full">
                <img
                    className="h-48 w-full rounded-md object-cover sm:rounded-none"
                    src={data.header_image_file ?? data.header_image}
                    alt=""
                />
                <HeadingWrapper className="absolute bottom-0 flex h-full w-full items-end rounded-md px-4 pb-3 text-5xl text-gray-50 sm:rounded-none">
                    {data.name}
                </HeadingWrapper>
            </header>
            <section className="col-span-2 grid w-full auto-rows-min grid-cols-3 gap-4">
                {/* <Input placeholder="Search" aria-label="Search for participant" /> */}
                <ul className="col-span-3 mr-4 flex items-end justify-end gap-4">
                    <li className="flex items-center gap-1">
                        <svg
                            className="text-green-400 dark:text-green-600"
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
                            className="text-yellow-400 dark:text-yellow-600"
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
                            className="text-red-400 dark:text-red-600"
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
                <div className="col-span-3 rounded-sm bg-white p-4 shadow-sm sm:rounded-none dark:bg-gray-800">
                    <h2 className="pb-4 text-xl">
                        Participants
                        <Link to={`/admin/competitions/${id}/results`} className="float-right text-base">
                            Results
                        </Link>
                    </h2>

                    {(entries?.results ?? []).length > 0 ? (
                        <ul className="pb-4">
                            {entries?.results.map((e, i) => (
                                <li key={e.id} className="my-3 flex flex-wrap items-end">
                                    <section className="flex-1">
                                        <h3 className="pb-4 font-medium">{e.title}</h3>
                                        <p className="font-light">{e.owner?.display_name}</p>
                                    </section>
                                    <span title={entryStateColors.find((c) => c.value === e.status.value)?.label}>
                                        <svg
                                            className={`${
                                                entryStateColors.find((c) => c.value === e.status.value)?.bg
                                            } mr-4 mb-1`}
                                            width="14"
                                            height="14"
                                            viewBox="0 0 14 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle cx="7" cy="7" r="7" fill="currentColor" />
                                        </svg>
                                    </span>

                                    <Link to={`/admin/competitions/${id}/${e.id}`} className="-mb-1 ml-4">
                                        More information
                                    </Link>
                                    {i < entries.results.length - 1 && (
                                        <hr className="my-6 w-full border-t border-gray-300 dark:border-gray-600" />
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
                <section className="sm-rounded-none mb-4 rounded-sm bg-white shadow-sm dark:bg-gray-800">
                    <h2 className="px-4 py-6 text-xl">{data.entries_count} registered</h2>
                </section>
                <section className="mb-4 rounded-sm bg-white p-4 shadow-sm sm:rounded-none dark:bg-gray-800">
                    <h2 className="pb-7 text-xl">Quick settings</h2>
                    {hasPermission(Permission.CompetitionsChangeCompetition, data.permissions) ? (
                        <>
                            <ul>
                                <li className="flex flex-wrap items-end pb-6">
                                    <section className="flex-1 text-sm">
                                        <h3 className="font-semibold">Publish status</h3>
                                        {data.published ? (
                                            <p>Published</p>
                                        ) : (
                                            <p className="text-red-500">Not published</p>
                                        )}
                                    </section>

                                    <Button loading={isUpdatingPublished} onClick={() => updatePublished()}>
                                        {data.published ? "Hide" : "Publish"}
                                    </Button>

                                    {/* <hr className="w-full my-6 border-t border-gray-300" /> */}
                                </li>
                                {/* <li className="flex flex-wrap items-end pb-4">
                            <section className="flex-1 px-4 text-sm">
                                <h3 className="font-semibold">Start time</h3>
                                {data.published ? <p>Published</p> : <p className="text-red-500">Not published</p>}
                            </section>

                            <button className="p-1 px-2 mx-4 text-indigo-700 underline transition-all duration-150 rounded-xs hover:text-indigo-900 hover:bg-indigo-200">
                                Change
                            </button>
                        </li> */}
                            </ul>
                            <Link to="edit">Edit</Link>
                        </>
                    ) : (
                        <p className="px-4 pb-6">You do not have access to any settings in this competition.</p>
                    )}
                </section>

                {hasPermission(Permission.CompetitionsDeleteCompetition, data.permissions) && (
                    <section>
                        <h2 className="sr-only">Danger zone</h2>
                        {validateDelete ? (
                            <div className="flex flex-wrap">
                                {isDeleting ? (
                                    <>
                                        <svg
                                            className="my-4 h-5 w-full animate-bounce text-center text-red-800 dark:text-red-300"
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
                            </div>
                        ) : (
                            <div key="off" className="flex flex-wrap justify-between gap-3">
                                <a
                                    href={`${import.meta.env.VITE_APP_API}/api/competitions/download-entries/${
                                        data.id
                                    }/download`}
                                    className="rounded-lg bg-blue-400 px-8 py-3 text-white transition-all duration-150 hover:bg-blue-900 dark:bg-blue-600"
                                >
                                    Download all qualified entries
                                </a>
                                <button
                                    onClick={() => setValidateDelete(true)}
                                    className="rounded-lg bg-red-400 px-8 py-3 text-white transition-all duration-150 hover:bg-red-900 dark:bg-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </section>
                )}
            </aside>
        </View>
    );
};

export default CompetitionAdminDetails;
