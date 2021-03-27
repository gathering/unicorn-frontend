import React, { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { httpPatch, httpPost } from '../../../utils/fetcher';
import { parseError } from '../../../utils/error';
import type { IEntry, IUploadFile } from '../competition.types';
import { RateStars } from './RateStars';

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

    return (
        <article className="flex flex-col items-center bg-white rounded-md sm:rounded-none">
            <a href={activeMainFile.url} target="_blank" rel="noopener noreferrer" className="w-full">
                {activeMainFileType === 'picture' ? (
                    <img src={activeMainFile.url} className="rounded-t-md sm:rounded-none" />
                ) : (
                    <p className="w-full py-6 transition-colors bg-gray-500 rounded-t-md text-tg-brand-orange-500 hover:bg-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-20 mx-auto"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </p>
                )}
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
        </article>
    );
};