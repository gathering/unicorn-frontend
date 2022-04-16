import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { httpPatch, httpPost } from '../../../utils/fetcher';
import { parseError } from '../../../utils/error';
import type { IEntry, IUploadFile } from '../competition';
import { RateStars } from './RateStars';
import { MusicPlayer } from '../../../components/MusicPlayer';

interface Props {
    entry: IEntry;
    onVote: (vote: any) => void;
    vote: any | undefined;
    uploadForm: IUploadFile[];
}

export const VoteCard = ({ entry, vote, onVote, uploadForm }: Props) => {
    const activeMainFile = useMemo(() => entry.files.find((f) => f.active && f.type === 'main'), [entry]);
    const activeMainFileType = useMemo(() => uploadForm.find((fu) => fu.type === 'main')?.file, [uploadForm]);
    const [isFetching, setIsFetching] = useState(false);

    const createVote = (score: number) => {
        setIsFetching(true);

        httpPost('competitions/votes', JSON.stringify({ entry: entry.id, score }))
            .then((d) => {
                onVote(d);
                setIsFetching(false);
            })
            .catch((err) => {
                toast.error('Error creating competition');
                parseError(err).forEach((e: any) => toast.error(e));
            });
    };
    const updateVote = (score: number) => {
        if (!vote) {
            return;
        }

        setIsFetching(true);

        httpPatch(`competitions/votes/${vote.id}`, JSON.stringify({ score }))
            .then((d) => {
                onVote(d);
                setIsFetching(false);
            })
            .catch((err) => {
                toast.error('Error creating competition');
                parseError(err).forEach((e: any) => toast.error(e));
            });
    };

    const handleVote = (score: number) => {
        if (vote) {
            updateVote(score);
        } else {
            createVote(score);
        }
    };

    if (!activeMainFile) {
        return null;
    }

    return (
        <article className="flex flex-col items-center bg-white rounded-md sm:rounded-none">
            {activeMainFileType === 'picture' ? (
                <>
                    <a href={activeMainFile.url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <img src={activeMainFile.url} className="rounded-t-md sm:rounded-none" />
                    </a>
                    <h2 className="my-3 text-2xl text-gray-700">{entry.title}</h2>
                    {entry.is_contributor ? (
                        <p className="px-5 pb-6 text-center">
                            {entry.is_owner
                                ? 'You cannot vote for your own entry'
                                : 'You cannot vote for an entry where you are a registered participant'}
                        </p>
                    ) : (
                        <RateStars score={vote?.score ?? 0} onChange={handleVote} isFetching={isFetching} />
                    )}
                </>
            ) : activeMainFileType === 'music' ? (
                <>
                    <h2 className="my-3 text-2xl text-gray-700">{entry.title}</h2>
                    {entry.is_contributor ? (
                        <p className="px-5 pb-6 text-center">
                            {entry.is_owner
                                ? 'You cannot vote for your own entry'
                                : 'You cannot vote for an entry where you are a registered participant'}
                        </p>
                    ) : (
                        <RateStars score={vote?.score ?? 0} onChange={handleVote} isFetching={isFetching} />
                    )}
                    <audio className="box-border w-full px-4 mb-4" controls src={activeMainFile.url} />
                </>
            ) : (
                <>
                    <a href={activeMainFile.url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <p className="flex items-center justify-center w-full p-6 py-6 text-lg text-white transition-colors bg-gray-700 rounded-t-md hover:bg-gray-900">
                            Open file
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="pl-4 h-7"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </p>
                    </a>
                    <h2 className="my-3 text-2xl text-gray-700">{entry.title}</h2>
                    {entry.is_contributor ? (
                        <p className="px-5 pb-6 text-center">
                            {entry.is_owner
                                ? 'You cannot vote for your own entry'
                                : 'You cannot vote for an entry where you are a registered participant'}
                        </p>
                    ) : (
                        <RateStars score={vote?.score ?? 0} onChange={handleVote} isFetching={isFetching} />
                    )}
                </>
            )}
            {entry.vote_msg && (
                <p
                    className="mb-2 text-indigo-800 hover:text-indigo-500 hover:underline"
                    dangerouslySetInnerHTML={{ __html: entry.vote_msg }}
                ></p>
            )}
        </article>
    );
};
