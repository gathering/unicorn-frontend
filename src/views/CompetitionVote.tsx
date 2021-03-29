import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { httpGet } from '../utils/fetcher';
import { View } from '../components/View';
import { VoteCard } from '../features/competitions/VoteCard';
import type { ICompetition, IEntryListResponse } from '../features/competitions/competition.types';

const CompetitionVote = () => {
    const { cid } = useParams<{ cid: string }>();
    const { data: competition } = useSWR<ICompetition>(`competitions/competitions/${cid}`, httpGet);
    const { data: entries, isValidating: isValidatingEntries } = useSWR<IEntryListResponse>(
        `competitions/entries/?competition_id=${cid}&limit=1000`,
        httpGet,
        { revalidateOnFocus: false }
    );
    const {
        data: votes,
        mutate: mutateVotes,
        isValidating: isValidatingVotes,
    } = useSWR(`competitions/votes?limit=1000`, httpGet, { revalidateOnFocus: false });

    const votableEntries = useMemo(
        () =>
            entries?.results.filter((e) => {
                // status qualified
                return true;

                if (e.status.value === 4) {
                    return true;
                }

                return false;
            }) ?? [],
        [entries]
    );

    const onVote = (vote) => {
        mutateVotes({
            ...votes,
            result: votes.results.map((v) => {
                if (v.id === vote.id) {
                    return vote;
                }

                return v;
            }),
        });
    };

    if (isValidatingEntries || !votes || !competition) {
        return null;
    }

    if (competition.state.value !== 32) {
        return (
            <View className="container mx-auto">
                <h1 role="alert" className="mt-32 text-xl text-center">
                    This competition is not open for voting yet.
                </h1>
            </View>
        );
    }

    return (
        <View className="container grid grid-cols-3 gap-4 mx-auto md:grid-cols-2 sm:grid-cols-1">
            <h1 className="col-span-3 mt-6 text-3xl md:col-span-2 sm:col-span-1">Vote for the awesome entries!</h1>
            <p className="col-span-3 mb-8 md:col-span-2 sm:col-span-1">
                Every vote counts, so please vote for all entries
            </p>
            {votableEntries.map((e) => (
                <VoteCard
                    key={e.id}
                    entry={e}
                    uploadForm={competition?.fileupload}
                    vote={votes.results.find((v) => v.entry === e.id)}
                    onVote={onVote}
                />
            ))}
        </View>
    );
};

export default CompetitionVote;
