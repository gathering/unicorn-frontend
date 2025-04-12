import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Dialog } from "@reach/dialog";
import { VisuallyHidden } from "@reach/visually-hidden";
import type { ICompetition, IEntry, IFile } from "@features/competitions/competition";
import { PrimaryButton, SecondaryButton } from "@components/Button";
import { httpGet, httpPatch } from "@utils/fetcher";
import { hasFileupload } from "@utils/competitions";
import { Input } from "@components/Input";
import { View } from "@components/View";
import { Link } from "@components/Link";
import { parseError } from "@utils/error";

const HeadingWrapper = styled.h1`
    background: linear-gradient(5deg, #00000088 30%, #ffffff22 100%);
`;

interface IFormData {
    preselect?: boolean;
    comment?: boolean;
}

const CompetitionAdminEntry = () => {
    const { id, eid } = useParams<{ id: string; eid: string }>();
    const [showDisqualify, setShowDisqualify] = useState(false);
    const { data: competition } = useSWR<ICompetition>("competitions/competitions/" + id, httpGet);
    const { data: entry, mutate } = useSWR<IEntry>("competitions/entries/" + eid, httpGet);
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm<IFormData>();

    const preselect = watch("preselect");

    const nextEntry = useMemo(() => {
        if (!competition?.entries) {
            return undefined;
        }

        const index = competition.entries.findIndex((e) => e.id.toString() === eid);
        if (index === -1 || index === competition.entries.length - 1) {
            return undefined;
        }

        return competition.entries[index + 1];
    }, [competition, eid, entry]);

    const previousEntry = useMemo(() => {
        if (!competition?.entries) {
            return undefined;
        }

        const index = competition.entries.findIndex((e) => e.id.toString() === eid);
        if (index === -1 || index === 0) {
            return undefined;
        }

        return competition.entries[index - 1];
    }, [competition, eid, entry]);

    const handleQualify = () => {
        httpPatch(`competitions/entries/${eid}`, JSON.stringify({ status: 4 })).then(() => mutate());
    };
    const handleDisqualify = (formData: IFormData) => {
        if (formData.preselect === true) {
            httpPatch(`competitions/entries/${eid}`, JSON.stringify({ status: 16 })).then(() => {
                setShowDisqualify(false);
                mutate();
            });
        } else {
            httpPatch(`competitions/entries/${eid}`, JSON.stringify({ status: 8, comment: formData.comment }))
                .then(() => {
                    setShowDisqualify(false);
                    mutate();
                })
                .catch((err) => {
                    parseError(err).forEach((e: any) => toast.error(e));
                });
        }
    };

    const activeMainFile: IFile | undefined = useMemo(
        () => entry?.files.find((f) => f.active && f.type === "main"),
        [entry],
    );
    const activeMainFileType = useMemo(
        () => competition?.fileupload?.find((fu) => fu.type === "main")?.file,
        [competition],
    );

    if (!competition || !entry) {
        return null;
    }

    const hasUpload = hasFileupload(competition);

    return (
        <View className="container grid grid-cols-3 gap-4 mx-auto my-12 sm:my-0">
            <header className="relative w-full h-48 col-span-3 mb-6">
                <img
                    className="object-cover w-full h-48 rounded-md sm:rounded-none"
                    src={competition.header_image}
                    alt=""
                />
                <HeadingWrapper className="absolute bottom-0 flex items-end w-full h-full px-4 pb-3 text-5xl rounded-md sm:rounded-none text-gray-50">
                    {competition.name}
                </HeadingWrapper>
            </header>
            <section className="col-span-2 bg-white rounded shadow dark:bg-gray-800 sm:rounded-none">
                <h2 className="p-4 text-xl">
                    {entry.title}
                    <br />
                    <span className="font-light">{entry.owner?.display_name}</span>
                </h2>

                {entry.crew_msg && (
                    <p className="p-4 border-t border-tg-brand-orange-500">
                        <strong className="font-semibold text-gray-700 dark:text-gray-300">
                            Message from participant:
                        </strong>{" "}
                        {entry.crew_msg}
                    </p>
                )}
            </section>
            {hasUpload && (
                <section className="grid grid-cols-2 col-span-2 bg-white rounded shadow dark:bg-gray-800 sm:rounded-none">
                    <h2 className="col-span-1 col-start-1 p-4 text-xl">Files</h2>
                    <ul className="col-span-1 col-start-1 px-4 pb-4">
                        {competition.fileupload.map((fu) => {
                            const file: IFile | undefined = entry.files.find((f) => f.active && f.type === fu.type);
                            return (
                                <li key={fu.type}>
                                    <h3 className="mt-4 mb-1 text-xl font-light">{fu.input}</h3>
                                    {file ? (
                                        <>
                                            {file.type === "screenshot" ? (
                                                <a href={file.url} aria-label={file.name}>
                                                    <img src={file.url} alt={fu.input} className="h-32" />
                                                </a>
                                            ) : (
                                                <a
                                                    href={file.url}
                                                    className="p-1 px-2 -ml-2 text-indigo-700 underline transition-all duration-150 rounded-sm dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 hover:bg-indigo-200 dark:hover:bg-indigo-500"
                                                >
                                                    {file.name}
                                                </a>
                                            )}
                                        </>
                                    ) : (
                                        <span
                                            className="px-2 py-1 text-sm bg-red-200 rounded-md dark:bg-red-400 "
                                            role="alert"
                                        >
                                            No file uploaded yet
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    {activeMainFileType === "picture" && (
                        <img
                            className="col-start-2 row-span-2 row-start-1 rounded-r"
                            src={activeMainFile?.url}
                            alt=""
                        />
                    )}
                </section>
            )}
            <section className="col-span-2 bg-white rounded shadow dark:bg-gray-800 sm:rounded-none">
                <h2 className="p-4 text-xl">Contributors</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="text-gray-500 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase"
                            >
                                Display Name
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase"
                            >
                                Phone number
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase"
                            >
                                Row/Seat
                            </th>
                            {competition.contributor_extra && (
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase"
                                >
                                    {competition.contributor_extra}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {entry.contributors.map((c) => (
                            <tr key={c.uuid}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {c.is_owner && (
                                        <span className="px-1 mr-4 font-light text-white rounded dark:text-tg-brand-orange-50 bg-tg-brand-orange-500 dark:bg-tg-brand-orange-600 ">
                                            Owner
                                        </span>
                                    )}{" "}
                                    {c.user.first_name} {c.user.last_name}
                                    <br />
                                    <span className="font-light text-gray-800 dark:text-gray-200">
                                        {c.user.display_name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{c.user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{c.user.phone_number}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {c.user.row}/{c.user.seat}
                                </td>
                                {competition.contributor_extra && (
                                    <td className="px-6 py-4 whitespace-nowrap">{c.extra_info}</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <aside className="col-start-3 row-span-3 row-start-2">
                <section className="flex flex-col flex-wrap p-4 bg-white rounded shadow dark:bg-gray-800 sm:rounded-none">
                    <h2 className="text-xl">Status</h2>

                    <p>
                        {entry.status.value === 4
                            ? "Qualified"
                            : entry.status.value === 8
                              ? `Disqualified: ${entry.comment}`
                              : entry.status.value === 16
                                ? "Not preselected"
                                : entry.status.label}
                    </p>

                    <footer className="flex flex-wrap gap-4 mt-6">
                        {entry.status.value !== 4 && (
                            <PrimaryButton className="w-36" onClick={handleQualify}>
                                Qualify
                            </PrimaryButton>
                        )}
                        <SecondaryButton onClick={() => setShowDisqualify(true)} className="w-36">
                            Disqualify
                        </SecondaryButton>
                    </footer>
                </section>
                {(nextEntry || previousEntry) && (
                    <section className="my-6">
                        {previousEntry && (
                            <Link to={`/admin/competitions/${id}/${previousEntry.id}`} className="mr-6">
                                Previous entry
                            </Link>
                        )}
                        {nextEntry && <Link to={`/admin/competitions/${id}/${nextEntry.id}`}>Next entry</Link>}
                    </section>
                )}
            </aside>
            <footer className="col-span-3 mt-4">
                <Link to={`/admin/competitions/${id}`}>Back to competition</Link>{" "}
            </footer>
            <Dialog
                isOpen={showDisqualify}
                onDismiss={() => setShowDisqualify(false)}
                className="rounded-md dark:bg-gray-700 dark:text-gray-100"
                aria-label={`Disqualify ${entry.title}`}
            >
                <VisuallyHidden>
                    <button className="close-button" onClick={() => setShowDisqualify(false)}>
                        Close
                    </button>
                </VisuallyHidden>
                <h2 className="mb-3 text-xl">Disqualify {entry.title}</h2>
                <p>A reason is required if this is not a result of not being preselected.</p>
                <form onSubmit={handleSubmit(handleDisqualify)}>
                    <label className="block mt-6">
                        <input {...register("preselect")} type="checkbox" className="mr-2" />
                        Not preselected
                    </label>

                    {preselect !== true && (
                        <Input
                            {...register("comment", { required: "You need to give the participant a reason" })}
                            label="Disqualification reason"
                            helpLabel="This will be displayed to the participant"
                            labelClassName="mt-5"
                            className="w-full"
                            errorLabel={errors.comment?.message}
                        />
                    )}

                    <PrimaryButton className="mt-4">Submit</PrimaryButton>
                </form>
            </Dialog>
        </View>
    );
};

export default CompetitionAdminEntry;
