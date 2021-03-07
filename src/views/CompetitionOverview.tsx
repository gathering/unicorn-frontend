import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import type { ICompetitionListResponse, IGenreResponse } from '../features/competitions/competition.types';
// import FeaturedCompetitions from '../features/competitions/FeaturedCompetitions';
import { httpGet } from '../utils/fetcher';
import { Select } from '../components/Select';
import { Input } from '../components/Input';
import { View } from '../components/View';
import { useUserState } from '../context/Auth';
import '@reach/listbox/styles.css';
import { motion } from 'framer-motion';

const CompetitionsOverview: React.FC = () => {
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const { user } = useUserState();

    const { data: competitionResult, isValidating } = useSWR<ICompetitionListResponse>(
        'competitions/competitions',
        httpGet
    );
    const { data: genreResult } = useSWR<IGenreResponse>('competitions/genres', httpGet);

    const competitions = useMemo(() => {
        if (competitionResult) {
            return competitionResult.results;
        }

        return [];
    }, [competitionResult]);

    const options = useMemo(() => {
        if (genreResult) {
            return genreResult.results.map((genre) => ({ label: genre.name, value: genre.id }));
        }
        return [];
    }, [genreResult]);

    const featuredCompetitions = useMemo(() => competitions.filter((c) => c.featured), [competitions]);

    const filteredCompetitions = useMemo(
        () =>
            competitions
                .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
                .filter((c) => (!genre ? true : genre === c.genre.id.toString()))
                .filter((c) => c.published),
        [competitions, search, genre]
    );

    return (
        <View>
            {/* <FeaturedCompetitions competitions={featuredCompetitions} /> */}

            <div className="flex flex-row mobile:flex-col">
                <aside className="flex flex-col mx-10 mt-12 mobile:flex-row mobile:m-4">
                    <Input
                        className="mb-6 mobile:mb-0"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Select
                        options={options}
                        aria-label="Select genre"
                        placeholder="Select genre"
                        value={genre}
                        onChange={setGenre}
                    />
                    {user?.role.value === 'crew' && (
                        <>
                            <Link
                                to="/admin/competitions"
                                className="flex items-center h-12 px-4 mt-10 text-base font-semibold text-yellow-800 duration-150 bg-yellow-300 rounded justify-evenly hover:bg-yellow-700 hover:text-black hover:shadow"
                            >
                                Admin
                            </Link>
                            <Link
                                to="/admin/competitions/new"
                                className="flex items-center h-12 px-4 mt-6 text-base font-semibold text-green-800 duration-150 bg-green-300 rounded justify-evenly hover:bg-green-700 hover:text-black hover:shadow"
                            >
                                New competition
                            </Link>
                        </>
                    )}
                </aside>
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
                        className="flex flex-col items-center w-full mt-12 mb-10 mr-10 mobile:mt-4"
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
                                <Link to={'/competitions/' + competition.id} className="flex h-32 mobile:flex-col">
                                    <img
                                        className="flex-none object-cover w-64 overflow-hidden text-center bg-cover rounded-l mobile:rounded-none"
                                        src={competition.header_image}
                                        alt={`Competition poster ${competition.name}`}
                                    />
                                    <div className="flex flex-col justify-between w-full p-4 leading-normal bg-white">
                                        <p className="text-sm leading-none text-gray-600">{competition.state.label}</p>
                                        <div className="mb-2 text-xl font-bold text-black">{competition.name}</div>
                                        <p className="text-xl text-gray-600">{competition.brief_description}</p>
                                    </div>
                                    <div className="flex pr-4 bg-white rounded-r mobile:rounded-none">
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
                    <article className="flex flex-col items-center w-full mt-12 mb-10 mr-10 mobile:mt-4">
                        <h1 className="mt-32 text-4xl text-gray-800">
                            {competitionResult ? 'No competitions found' : 'Loading...'}
                        </h1>
                        {competitionResult && <p className="text-2xl text-gray-600">#isiteasteryet</p>}
                    </article>
                )}
            </div>
        </View>
    );
};

export default CompetitionsOverview;
