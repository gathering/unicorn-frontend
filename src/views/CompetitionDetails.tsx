import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import draftToHtml from 'draftjs-to-html';
import dayjs from 'dayjs';
import useSWR from 'swr';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import CompetitionPhases from '../features/competitions/CompetitionPhases';
import { amIParticipant, hasPreRegistration, hasVote } from '../utils/competitions';
import type { ICompetition } from '../features/competitions/competition.types';
import { formatNumber } from '../utils/numbers';
import { useAuth } from '../context/auth';
import { httpGet } from '../utils/fetcher';
import './CompetitionDetails.scss';
import '@reach/tabs/styles.css';

dayjs.extend(advancedFormat);

const convertDraftToHtml = (data: any) => {
    let html = data;

    try {
        html = draftToHtml(JSON.parse(data));
    } catch (_) {
        return html;
    }

    return html;
};

const format = (date: string) => dayjs(date).format('HH:mm Do MMM');

const CompetitionDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { data } = useSWR<ICompetition>('competitions/competitions/' + id, httpGet);

    const competitionDescription = useMemo(() => convertDraftToHtml(data?.description), [data]);
    const competitionRules = useMemo(() => convertDraftToHtml(data?.rules), [data]);

    const hasEntry = useMemo(() => (data ? amIParticipant(data) : false), [data]);

    if (!data) {
        // TODO Return loading component
        return null;
    }

    return (
        <div className="container mx-auto my-12 ">
            <div className="relative">
                <img className="object-cover w-full h-48 mb-10 rounded-md" src={data.header_image} alt="" />
                <h1 className="absolute bottom-0 w-full px-4 text-5xl text-white bg-black bg-opacity-75 rounded-b-lg">
                    {data.name}
                </h1>
            </div>
            <div className="flex flex-horizontal">
                <div className="flex-grow">
                    <CompetitionPhases competition={data} />
                    <Tabs className="bg-white rounded">
                        <TabList className="flex">
                            {competitionDescription && <Tab className="flex-grow py-3 border-b">Information</Tab>}
                            <Tab className="flex-grow py-3 border-b">Rules</Tab>
                        </TabList>
                        <TabPanels className="p-4">
                            {competitionDescription && (
                                <TabPanel>
                                    <div dangerouslySetInnerHTML={{ __html: competitionDescription }} />
                                </TabPanel>
                            )}
                            <TabPanel>
                                <div dangerouslySetInnerHTML={{ __html: competitionRules }} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
                <aside style={{ minWidth: '20rem' }} className="ml-10">
                    {user && (
                        <>
                            <Link
                                to={`/competitions/${id}/register`}
                                className="flex items-center h-12 px-4 mb-6 text-base font-semibold text-green-800 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow"
                            >
                                {hasEntry ? 'Check registration' : 'Register now!'}
                            </Link>
                        </>
                    )}

                    <section className="p-4 mb-4 bg-white rounded">
                        <h2 className="pb-2 text-lg">Schedule</h2>
                        {
                            <ul className="w-2/3 mt-2 leading-8">
                                {hasPreRegistration(data) && (
                                    <li>
                                        <h3 className="font-bold">Registration</h3>
                                        {format(data.register_time_start)}
                                        <br />
                                        {format(data.register_time_end)}
                                    </li>
                                )}
                                <li>
                                    <h3 className="font-bold">Competition</h3>
                                    {format(data.run_time_start)} <br />
                                    {format(data.run_time_end)}
                                </li>
                                {hasVote(data) && (
                                    <li>
                                        <h3 className="font-bold">Voting</h3>
                                        {format(data.vote_time_start)} <br />
                                        {format(data.vote_time_end)}
                                    </li>
                                )}
                            </ul>
                        }
                    </section>

                    {!!data.prizes.length && (
                        <section className="p-4 bg-white rounded">
                            <h2 className="pb-2 text-lg">Prizes</h2>
                            <ul className="w-2/3 mt-2 leading-8">
                                {data.prizes.map((prize: String, i: number) => (
                                    <li key={prize + i.toString()} className="pr-3">
                                        {formatNumber(i + 1)} <span className="float-right">{prize}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default CompetitionDetails;
