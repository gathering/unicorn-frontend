import React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import styled from 'styled-components';
import type { ICompetition, IEntry, IFile } from '../features/competitions/competition.types';
import { httpGet } from '../utils/fetcher';
import { View } from '../components/View';
import { hasFileupload } from '../utils/competitions';
import { FileUpload } from '../features/competitions/FileUpload';
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
                    {entry.title}{' '}
                    <span className="ml-4 font-light">
                        {entry.contributors.find((c) => c.is_owner)?.user.display_name}
                    </span>
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
                                        <h3 className="mb-2 text-xl font-light">{fu.file}</h3>
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
            <aside className="col-start-3 row-span-3 row-start-2 bg-white rounded shadow sm:rounded-none">
                <h2 className="p-4 text-xl">Status</h2>

                <p className="px-6">Not yet handled</p>
            </aside>
            <footer className="col-span-3 mt-4">
                <Link to={`/admin/competitions/${cid}`}>Back to competition</Link>{' '}
            </footer>
        </View>
    );
};

export default CompetitionAdminEntry;
