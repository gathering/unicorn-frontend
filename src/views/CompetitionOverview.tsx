import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import type { ICompetitionListResponse, IGenreResponse } from "../features/competitions/competition";
// import FeaturedCompetitions from '../features/competitions/FeaturedCompetitions';
import { Input } from "../components/Input";
import { Link as ULink } from "../components/Link";
import { Select } from "../components/Select";
import { View } from "../components/View";
import { useUserState } from "../context/Auth";
import { httpGet } from "../utils/fetcher";
import { hasPermission, Permission } from "../utils/permissions";

const re = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]+\b/;

const CompetitionsOverview: React.FC = () => {
    const [search, setSearch] = useState("");
    const { user, permissions } = useUserState();

    const plausibleAutogeneratedNick = useMemo(() => {
        if (!user) {
            return false;
        }

        return re.test(user.display_name);
    }, [user]);

    const { data: competitionResult, isLoading } = useSWR<ICompetitionListResponse>(
        "competitions/competitions",
        httpGet
    );
    const { data: genreResult } = useSWR<IGenreResponse>("competitions/genres", httpGet, { revalidateOnFocus: false });

    const competitions = useMemo(() => {
        if (competitionResult) {
            return competitionResult.results;
        }

        return [];
    }, [competitionResult]);

    const options = useMemo(() => {
        if (genreResult) {
            return genreResult.results.map((genre) => ({ label: genre.name, value: genre.id.toString() }));
        }
        return [];
    }, [genreResult]);

    const genreOptions = [{ label: "All genres", value: "__all__" }, ...options];
    const [genre, setGenre] = useState(genreOptions[0].value);

    // const featuredCompetitions = useMemo(() => competitions.filter((c) => c.featured), [competitions]);

    const filteredCompetitions = useMemo(
        () =>
            competitions
                .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
                .filter((c) => (!genre ? true : genre === "__all__" ? true : genre === c.genre.id.toString()))
                .filter((c) => c.published),
        [competitions, search, genre]
    );

    return (
        <View>
            {user && plausibleAutogeneratedNick && (
                <section
                    className="mx-auto ml-10 mt-4 max-w-prose border-l-4 border-yellow-500 bg-yellow-100 px-3 py-4 text-yellow-700"
                    role="alert"
                >
                    <h2 className="pb-2 font-bold">Autogenerated nick detected: {user.display_name}</h2>
                    <p>
                        Click{" "}
                        <ULink inline to="/preferences">
                            here
                        </ULink>{" "}
                        to change your display name
                    </p>
                </section>
            )}
            {/* <FeaturedCompetitions competitions={featuredCompetitions} /> */}

            <div className="flex flex-row sm:flex-col">
                <aside className="mx-10 mt-12 flex flex-col sm:m-4">
                    <Input
                        className="mb-6 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:bg-gray-900 sm:mb-2"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <Select options={genreOptions} label="Select genre" value={genre} onChange={setGenre} />
                    {hasPermission(
                        [
                            Permission.CompetitionsChangeCompetition,
                            Permission.CompetitionsDeleteCompetition,
                            Permission.CompetitionsAddCompetition,
                            Permission.CompetitionsModifyAll,
                        ],
                        permissions
                    ) && (
                        <Link
                            to="/admin/competitions"
                            className="mt-10 flex h-12 items-center justify-evenly rounded bg-yellow-300 px-4 text-base font-semibold text-yellow-800 duration-150 hover:bg-yellow-700 hover:text-black hover:shadow dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-500"
                        >
                            Admin
                        </Link>
                    )}
                    {hasPermission(Permission.CompetitionsAddCompetition, permissions) && (
                        <Link
                            to="/admin/competitions/new"
                            className="mt-6 flex h-12 items-center justify-evenly rounded bg-green-300 px-4 text-base font-semibold text-green-800 duration-150 hover:bg-green-700 hover:text-black hover:shadow dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-500"
                        >
                            New competition
                        </Link>
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
                        className="mb-10 mr-10 mt-12 flex w-full flex-col items-center sm:mt-4"
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
                                className="mb-6 w-full duration-200 hover:shadow-xl"
                                key={competition.id}
                            >
                                <Link to={"/competitions/" + competition.id} className="flex h-32">
                                    <img
                                        className="w-64 flex-none overflow-hidden rounded-l bg-gray-400 bg-cover object-cover text-center sm:w-40 sm:rounded-none"
                                        src={competition.header_image_file ?? competition.header_image}
                                        alt={`Competition poster ${competition.name}`}
                                    />
                                    <div className="flex w-full flex-col justify-between bg-white p-4 leading-normal dark:bg-gray-800">
                                        <p className="text-sm leading-none text-gray-600 dark:text-gray-200">
                                            {competition.state.label}
                                        </p>
                                        <div className="mb-2 text-xl font-bold text-black dark:text-white">
                                            {competition.name}
                                        </div>
                                        <p className="text-xl text-gray-600 dark:text-gray-200">
                                            {competition.brief_description}
                                        </p>
                                    </div>
                                    <div className="flex rounded-r bg-white pr-4 dark:bg-gray-800 dark:text-gray-200 sm:hidden md:hidden">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="my-auto h-16"
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
                {!filteredCompetitions.length && !isLoading && (
                    <article className="mb-10 mr-10 mt-12 flex w-full flex-col items-center sm:mt-4">
                        <h1 className="mt-32 text-4xl text-gray-800 dark:text-white">
                            {competitionResult ? "No competitions found" : "Loading..."}
                        </h1>
                        {competitionResult && (
                            <p className="text-2xl text-gray-600 dark:text-gray-200">#isiteasteryet</p>
                        )}
                    </article>
                )}
            </div>
        </View>
    );
};

export default CompetitionsOverview;
