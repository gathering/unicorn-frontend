import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { View } from '../components/View';
import { useUserState } from '../context/Auth';
import type { ICompetitionListResponse } from '../features/competitions/competition.types';
import { httpGet } from '../utils/fetcher';

const CompetitionVoteOverview = () => {
    const { user } = useUserState();
    const { data: competitionResult, isValidating } = useSWR<ICompetitionListResponse>(
        'competitions/competitions',
        httpGet
    );

    const filteredCompetitions = useMemo(() => {
        if (!competitionResult) {
            return [];
        }

        return competitionResult.results.filter((c) => c.state.value === 32);
    }, [competitionResult]);

    if (!user) {
        <View className="p-4">
            <h1 className="mt-4 text-xl">Vote</h1>
            <h2 className="mt-10 text-xl text-center ">You need to be logged in to vote</h2>
        </View>;
    }

    return (
        <View className="p-4">
            <h1 className="mt-4 text-xl">Competitions open for voting</h1>

            {!!filteredCompetitions.length && (
                <motion.ul
                    initial="hidden"
                    animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.05,
                            },
                        },
                    }}
                    className="flex flex-col items-center w-full mt-12 mb-10 mr-10 sm:mt-4"
                >
                    {filteredCompetitions.map((competition) => (
                        <motion.li
                            whileHover={{
                                scale: 1.025,
                            }}
                            transition={{ duration: 0.1 }}
                            variants={{
                                hidden: { opacity: 0, y: -60 },
                                show: { opacity: 1, y: 0 },
                            }}
                            className="w-full mb-6 duration-200 hover:shadow-xl"
                            key={competition.id}
                        >
                            <Link to={'/competitions/' + competition.id + '/vote'} className="flex h-32">
                                <img
                                    className="flex-none object-cover w-64 overflow-hidden text-center bg-gray-400 bg-cover rounded-l sm:rounded-none"
                                    src={competition.header_image}
                                    alt={`Competition poster ${competition.name}`}
                                />
                                <div className="flex flex-col justify-between w-full p-4 leading-normal bg-white">
                                    <p className="text-sm leading-none text-gray-600">{competition.state.label}</p>
                                    <div className="mb-2 text-xl font-bold text-black">{competition.name}</div>
                                    <p className="text-xl text-gray-600">{competition.brief_description}</p>
                                </div>
                                <div className="flex pr-4 bg-white rounded-r sm:rounded-none">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </Link>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
            {!filteredCompetitions.length && !isValidating && (
                <article className="flex flex-col items-center w-full mt-12 mb-10 mr-10 sm:mt-4">
                    <h1 className="mt-32 text-4xl text-gray-800">
                        {competitionResult ? 'No competitions found' : 'Loading...'}
                    </h1>
                    {competitionResult && <p className="text-2xl text-gray-600">#isiteasteryet</p>}
                </article>
            )}
        </View>
    );
};

export default CompetitionVoteOverview;
