import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import styled from 'styled-components';
import type { ICompetition, IEntry, IFile } from '../features/competitions/competition.types';
import { httpGet } from '../utils/fetcher';
import { View } from '../components/View';
import { hasFileupload } from '../utils/competitions';
import { Link } from '../components/Link';

const HeadingWrapper = styled.h1`
    background: linear-gradient(5deg, #00000088 30%, #ffffff22 100%);
`;

const CompetitionAdminEntry = () => {
    const { cid, eid } = useParams<{ cid: string; eid: string }>();
    const { data: competition, isValidating: isValidatingCompetition } = useSWR<ICompetition>(
        'competitions/competitions/' + cid,
        httpGet
    );
    const { data: entry, isValidating: isValidatingEntry } = useSWR<IEntry>('competitions/entries/' + eid, httpGet);

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
            <section
                className="w-full col-span-2 px-3 py-4 mx-auto text-yellow-700 bg-yellow-100 border-l-4 border-yellow-500"
                role="alert"
            >
                <h2 className="pb-2 font-bold">This page is under active development</h2>
                <p>New features will be added shortly</p>
            </section>
            <section className="col-span-2 bg-white rounded shadow sm:rounded-none">
                <h2 className="p-4 text-xl">
                    {entry.title}
                    <br />
                    <span className="font-light">{entry.contributors.find((c) => c.is_owner)?.user.display_name}</span>
                </h2>
            </section>
            <section className="col-span-2 bg-white rounded shadow sm:rounded-none">
                {hasUpload && (
                    <>
                        <h2 className="p-4 text-xl">Files</h2>
                        <ul className="px-4 pb-4">
                            {competition.fileupload.map((fu) => {
                                const file: IFile | undefined = entry.files.find((f) => f.active && f.type === fu.type);
                                return (
                                    <li>
                                        <h3 className="mt-4 mb-1 text-xl font-light">{fu.input}</h3>
                                        {file ? (
                                            <a
                                                href={file.url}
                                                className="p-1 px-2 text-indigo-700 underline transition-all duration-150 rounded-sm hover:text-indigo-900 hover:bg-indigo-200"
                                            >
                                                {file.name}
                                            </a>
                                        ) : (
                                            <span className="px-2 py-1 text-sm bg-red-200 rounded-md " role="alert">
                                                No file uploaded yet
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </section>
            <aside className="col-start-3 row-span-3 row-start-2">
                <section className="p-4 bg-white rounded shadow sm:rounded-none">
                    <h2 className="text-xl">Status</h2>

                    <p>Not yet handled</p>
                </section>
                {(nextEntry || previousEntry) && (
                    <section className="my-6">
                        {previousEntry && (
                            <Link to={`/admin/competitions/${cid}/${previousEntry.id}`} className="mr-6">
                                Previous entry
                            </Link>
                        )}
                        {nextEntry && <Link to={`/admin/competitions/${cid}/${nextEntry.id}`}>Next entry</Link>}
                    </section>
                )}
            </aside>
            <footer className="col-span-3 mt-4">
                <Link to={`/admin/competitions/${cid}`}>Back to competition</Link>{' '}
            </footer>
        </View>
    );
};

export default CompetitionAdminEntry;
