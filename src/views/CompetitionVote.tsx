import { useMemo } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import useSWR from "swr";
import { View } from "../components/View";
import { VoteCard } from "../features/competitions/VoteCard";
import type { ICompetition, IEntryListResponse, IListResponse, IVote } from "../features/competitions/competition";
import { httpGet } from "../utils/fetcher";

const HeadingWrapper = styled.h1`
    background: linear-gradient(5deg, #00000088 30%, #ffffff22 100%);
`;

const CompetitionVote = () => {
    const { id: cid } = useParams<{ id: string }>();
    const { data: competition } = useSWR<ICompetition>(`competitions/competitions/${cid}`, httpGet);
    const { data: entries, isValidating: isValidatingEntries } = useSWR<IEntryListResponse>(
        `competitions/entries/?competition_id=${cid}&status=4&limit=1000`,
        httpGet,
        { revalidateOnFocus: false }
    );
    const { data: votes, mutate: mutateVotes } = useSWR<IListResponse<IVote>>(
        `competitions/votes?limit=1000`,
        httpGet,
        {
            revalidateOnFocus: false,
        }
    );

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

    const onVote = (vote: IVote) => {
        if (!votes) {
            return;
        }

        mutateVotes({
            ...votes,
            results: votes.results.filter((v) => v.entry !== vote.entry),
        });
    };

    if (isValidatingEntries || !votes || !competition) {
        return null;
    }

    if (competition.state.value !== 32) {
        return (
            <View className="container mx-auto">
                <h1 role="alert" className="mt-32 text-center text-xl">
                    This competition is not open for voting yet.
                </h1>
            </View>
        );
    }

    return (
        <View>
            <div className="container mx-auto my-12 sm:my-0">
                <div className="relative mb-10 sm:mb-6">
                    <img
                        className="h-48 w-full rounded-md object-cover sm:rounded-none"
                        src={competition.header_image}
                        alt=""
                    />
                    <HeadingWrapper className="absolute bottom-0 flex h-full w-full items-end rounded-md px-4 pb-3 text-5xl text-gray-50 sm:rounded-none">
                        {competition.name}
                    </HeadingWrapper>
                </div>
            </div>
            <main className="container mx-auto grid grid-cols-3 gap-4 sm:grid-cols-1 md:grid-cols-2">
                <h2 className="col-span-3 mt-6 text-3xl sm:col-span-1 md:col-span-2">Vote for the awesome entries!</h2>
                <p className="col-span-3 mb-8 sm:col-span-1 md:col-span-2">
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
            </main>
        </View>
    );
};

export default CompetitionVote;
