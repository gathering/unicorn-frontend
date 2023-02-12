import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import useSWR from "swr";
import { Input } from "../components/Input";
import { amIParticipantInCompetition, amIParticipantInEntryList, hasFileupload, hasTeams } from "../utils/competitions";
import type { ICompetition, IEntry, IEntryListResponse } from "../features/competitions/competition";
import { RegisterEntry } from "../features/competitions/RegisterEntry";
import { EditRegistration } from "../features/competitions/EditRegistration";
import { httpGet, httpPost, httpPut } from "../utils/fetcher";

enum FormType {
    UPLOAD_TEAM,
    TEAM_ONLY,
    UPLOAD_ONLY,
}

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
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<IFormData>();
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
    }, [hasEntry]);

    const onRegistrationFinish = () => {
        refetchEntries();
        refetchCompetition();
    };

    if (!data || !entries || isValidatingCompetitions || isValidatingEntries) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-24 h-24 mt-28 animate-bounce"
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
                        className="object-cover w-full h-48 rounded-md sm:rounded-none"
                        src={data.header_image}
                        alt=""
                    />
                    <HeadingWrapper className="absolute bottom-0 flex items-end w-full h-full px-4 pb-3 text-5xl rounded-md text-gray-50">
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
                <img className="object-cover w-full h-48 rounded-md sm:rounded-none" src={data.header_image} alt="" />
                <HeadingWrapper className="absolute bottom-0 flex items-end w-full h-full px-4 pb-3 text-5xl rounded-md text-gray-50">
                    {data.name}
                </HeadingWrapper>
            </div>
            <EditRegistration competition={data} entry={hasEntry} onRegistrationFinish={onRegistrationFinish} />
        </>
    );
};

export default CompetitionRegistration;
