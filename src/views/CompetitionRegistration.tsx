import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import styled from "styled-components";
import useSWR from "swr";
import type { ICompetition, IEntryListResponse } from "../features/competitions/competition";
import { EditRegistration } from "../features/competitions/EditRegistration";
import { RegisterEntry } from "../features/competitions/RegisterEntry";
import { amIParticipantInEntryList } from "../utils/competitions";
import { httpGet } from "../utils/fetcher";

interface IFormData {
    title: string;
    crew_msg?: string;
}

const HeadingWrapper = styled.h1`
    background: linear-gradient(5deg, #00000088 30%, #ffffff22 100%);
`;

// TODO Resign

const CompetitionRegistration = () => {
    const { id } = useParams<{ id: string }>();
    const { reset } = useForm<IFormData>();
    const {
        data,
        mutate: refetchCompetition,
        isValidating: isValidatingCompetitions,
    } = useSWR<ICompetition>("competitions/competitions/" + id, httpGet, { revalidateOnFocus: false });
    const {
        data: entries,
        mutate: refetchEntries,
        isValidating: isValidatingEntries,
    } = useSWR<IEntryListResponse>(`competitions/entries/?competition_id=${id}&limit=1000`, httpGet, {
        revalidateOnFocus: false,
    });

    const hasEntry = useMemo(() => (entries ? amIParticipantInEntryList(entries.results) : false), [entries]);

    useEffect(() => {
        if (hasEntry) {
            reset({
                title: hasEntry?.title,
                crew_msg: hasEntry?.crew_msg,
            });
        }
    }, [hasEntry, reset]);

    const onRegistrationFinish = () => {
        refetchEntries();
        refetchCompetition();
    };

    if (!data || !entries || isValidatingCompetitions || isValidatingEntries) {
        return (
            <div className="flex h-full flex-col items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="mt-28 h-24 w-24 animate-bounce"
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

    if (!hasEntry) {
        return (
            <>
                <div className="container relative mx-auto mt-4 sm:mb-4">
                    <img
                        className="h-48 w-full rounded-md object-cover sm:rounded-none"
                        src={data.header_image_file ?? data.header_image}
                        alt=""
                    />
                    <HeadingWrapper className="absolute bottom-0 flex h-full w-full items-end rounded-md px-4 pb-3 text-5xl text-gray-50">
                        {data.name}
                    </HeadingWrapper>
                </div>
                <RegisterEntry competition={data} onRegistrationFinish={onRegistrationFinish} />
            </>
        );
    }

    return (
        <>
            <div className="container relative mx-auto mt-4 sm:mb-4">
                <img
                    className="h-48 w-full rounded-md object-cover sm:rounded-none"
                    src={data.header_image_file ?? data.header_image}
                    alt=""
                />
                <HeadingWrapper className="absolute bottom-0 flex h-full w-full items-end rounded-md px-4 pb-3 text-5xl text-gray-50">
                    {data.name}
                </HeadingWrapper>
            </div>
            <EditRegistration
                competition={data}
                entry={hasEntry}
                onRegistrationFinish={onRegistrationFinish}
                revalidate={refetchEntries}
            />
        </>
    );
};

export default CompetitionRegistration;
